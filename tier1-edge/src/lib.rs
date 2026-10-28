//! Tier-1 inline edge guard. Pure decision logic; Envoy (proxy-wasm) bindings come next.

const AUTOMATION_UA_MARKERS: &[&str] = &["playwright", "puppeteer", "headlesschrome", "selenium"];

/// Returns true if the User-Agent matches a known automation framework.
pub fn is_automation_ua(user_agent: &str) -> bool {
    let ua = user_agent.to_ascii_lowercase();
    AUTOMATION_UA_MARKERS.iter().any(|m| ua.contains(m))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn blocks_playwright() {
        assert!(is_automation_ua("Playwright/1.40 Headless Engine"));
    }

    #[test]
    fn allows_chrome() {
        assert!(!is_automation_ua("Mozilla/5.0 Chrome/120"));
    }
}
