#![no_std]

extern crate alloc;

use picoalloc::PicoAlloc;

#[global_allocator]
static ALLOC: PicoAlloc = PicoAlloc::new();

#[no_mangle]
pub extern "C" fn verify_batch() -> bool {
    // TODO: Implement batch ed25519 signature verification using ed25519-dalek
    // and Bulletproof range proof verification.
    true
}

#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}

pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
