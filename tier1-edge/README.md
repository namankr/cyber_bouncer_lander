# Tier-1: Inline Edge Guard (Rust → WASM)

Planned scope:
- [x] Automation UA detection (`src/lib.rs`)
- [ ] proxy-wasm bindings for Envoy
- [ ] JA3/JA4 handshake fingerprinting
- [ ] Global token-bucket flood isolation
- [ ] Async out-of-band reports to Tier-2

Build: `cargo build --target wasm32-wasip1 --release`
