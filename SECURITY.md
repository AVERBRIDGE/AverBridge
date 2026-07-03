# Security Policy

## Scope

This policy covers the AVERBRIDGE frontend application and its simulated smart-contract interfaces.

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report security issues by emailing: **security@averbridge.example**

Include:
- A clear description of the vulnerability
- Steps to reproduce
- Impact assessment (what an attacker could achieve)
- Any suggested mitigation

You will receive an acknowledgement within 48 hours and a detailed response within 7 days.

## What we consider in scope

- Frontend logic that could misrepresent balances, fees, or transaction outcomes to users
- Any path that could cause users to sign transactions with unintended parameters
- Wallet connection flows that could expose private keys or seed phrases
- XSS, CSRF, or injection vulnerabilities in the UI

## What is out of scope (for this repo)

- The underlying smart contracts (bridge HTLC contracts and AMM contracts are audited separately)
- Third-party wallet software (Freighter, MetaMask, Phantom, etc.)
- Rate-limiting or DDoS against the RPC backend

## Our commitments

- We will never request private keys or seed phrases through the UI — ever
- All bridge and AMM contracts will be independently audited before mainnet launch
- Audit reports will be published publicly on the Help & Trust screen
- Practice mode (testnet) will remain available so users can verify behavior before using real funds

## Bug bounty

A formal bug bounty program will be announced at mainnet launch. Until then, responsible disclosure is appreciated and will be credited publicly (with your permission).
