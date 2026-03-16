use std::{env, fs, process};

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        eprintln!("Usage: pvm-linker <input.elf> <output.polkavm>");
        process::exit(1);
    }

    let input = &args[1];
    let output = &args[2];

    let elf = fs::read(input).expect("failed to read input ELF");

    let mut config = polkavm_linker::Config::default();
    config.set_strip(false);
    config.set_optimize(true);
    config.set_min_stack_size(64 * 1024);

    let linked = polkavm_linker::program_from_elf(
        config,
        polkavm_linker::TargetInstructionSet::ReviveV1,
        &elf,
    )
    .expect("failed to link polkavm program");

    fs::write(output, linked).expect("failed to write output");
    println!("Linked {} -> {} ({} bytes)", input, output, fs::metadata(output).unwrap().len());
}
