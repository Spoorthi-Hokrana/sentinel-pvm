#![no_std]

extern crate alloc;

use alloc::vec;
use core::alloc::{GlobalAlloc, Layout};
use core::cell::UnsafeCell;
use core::sync::atomic::{AtomicUsize, Ordering};
use ed25519_dalek::{Signature, Verifier, VerifyingKey};
use pallet_revive_uapi::{HostFn, HostFnImpl, ReturnFlags};

// ── Bump allocator (sbrk-free) ──────────────────────────────────────
// pallet-revive rejects contracts using the sbrk instruction.
// A bump allocator over a static buffer avoids sbrk entirely.
// Memory is never individually freed — fine for single-invocation contracts.

const HEAP_SIZE: usize = 64 * 1024;

#[repr(align(32))]
struct Heap(UnsafeCell<[u8; HEAP_SIZE]>);
unsafe impl Sync for Heap {}

static HEAP: Heap = Heap(UnsafeCell::new([0u8; HEAP_SIZE]));
static OFFSET: AtomicUsize = AtomicUsize::new(0);

struct BumpAllocator;

#[global_allocator]
static ALLOCATOR: BumpAllocator = BumpAllocator;

unsafe impl GlobalAlloc for BumpAllocator {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        let size = layout.size();
        let align = layout.align();

        loop {
            let cur = OFFSET.load(Ordering::Relaxed);
            let aligned = (cur + align - 1) & !(align - 1);
            let end = aligned + size;

            if end > HEAP_SIZE {
                return core::ptr::null_mut();
            }

            if OFFSET
                .compare_exchange_weak(cur, end, Ordering::Relaxed, Ordering::Relaxed)
                .is_ok()
            {
                return (HEAP.0.get() as *mut u8).add(aligned);
            }
        }
    }

    unsafe fn dealloc(&self, _ptr: *mut u8, _layout: Layout) {}
}

// ── Contract entry points ────────────────────────────────────────────

/// Constructor — called once on deployment. Stateless coprocessor needs no init.
#[no_mangle]
#[polkavm_derive::polkavm_export]
pub extern "C" fn deploy() {}

/// Entry point — reads a batch of ed25519 signatures from call data,
/// verifies each one, and returns 0x01 (all valid) or 0x00 (any failure).
#[no_mangle]
#[polkavm_derive::polkavm_export]
pub extern "C" fn call() {
    let result = match verify_signatures() {
        Some(true) => &[0x01u8][..],
        _ => &[0x00u8][..],
    };
    HostFnImpl::return_value(ReturnFlags::empty(), result);
}

// ── Signature verification ───────────────────────────────────────────

/// Binary payload format (little-endian):
///   [0..4]       u32 — number of signature entries
///   Per entry (128 bytes):
///     [0..32]    ed25519 public key
///     [32..64]   message (telemetry data point, e.g. soil moisture hash)
///     [64..128]  ed25519 signature
fn verify_signatures() -> Option<bool> {
    let size = HostFnImpl::call_data_size() as usize;
    if size < 4 {
        return None;
    }

    let mut input = vec![0u8; size];
    HostFnImpl::call_data_copy(&mut input, 0);

    let count = u32::from_le_bytes(input[0..4].try_into().ok()?) as usize;

    if size < 4 + count * 128 {
        return None;
    }

    let mut offset = 4;
    for _ in 0..count {
        let pk: [u8; 32] = input[offset..offset + 32].try_into().ok()?;
        let msg = &input[offset + 32..offset + 64];
        let sig: [u8; 64] = input[offset + 64..offset + 128].try_into().ok()?;

        let key = VerifyingKey::from_bytes(&pk).ok()?;
        if key.verify(msg, &Signature::from_bytes(&sig)).is_err() {
            return Some(false);
        }

        offset += 128;
    }

    Some(true)
}

#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}
