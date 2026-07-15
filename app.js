/* ==========================================
   Antigravity 2.0 마스터 코스 JS 스크립트
   (보안 로그인, 아코디언 모션 및 사이드바 내비게이션 스크롤 동기화)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // SHA-256 단방향 암호화 변환 함수
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    // 0. 로그인 보호 및 로컬스토리지 세션 유지 기능
    const loginOverlay = document.getElementById("login-overlay");
    const passwordInput = document.getElementById("password-input");
    const loginBtn = document.getElementById("login-btn");
    const loginError = document.getElementById("login-error");

    // 비밀번호 해시값 (0000)
    const TARGET_HASH = "9a201f97b5e8a53e45dfb08e2f8c5b05adbe840294d1dae8ee9aa255d614dc35";

    // 로컬 스토리지에 이미 인증 기록이 있다면 즉시 오버레이 제거
    if (localStorage.getItem("edu_authenticated") === "true") {
        loginOverlay.classList.add("hidden");
    }

    async function handleLogin() {
        const inputVal = passwordInput.value;
        const hashedVal = await sha256(inputVal);

        if (hashedVal === TARGET_HASH) {
            localStorage.setItem("edu_authenticated", "true");
            loginOverlay.classList.add("hidden");
            loginError.textContent = "";
        } else {
            loginError.textContent = "비밀번호가 올바르지 않습니다.";
            passwordInput.value = "";
            passwordInput.focus();
        }
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", handleLogin);
    }
    if (passwordInput) {
        passwordInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                handleLogin();
            }
        });
    }

    // 1. 아코디언 토글 기능
    const cards = document.querySelectorAll(".week-card");

    cards.forEach((card) => {
        // 실습 카드(has-practice)는 고정되어 있으므로 토글 기능에서 배제
        if (card.classList.contains("has-practice")) {
            return;
        }

        const header = card.querySelector(".card-header");
        header.addEventListener("click", () => {
            card.classList.toggle("open");
        });
    });

    // 2. 사이드바 스크롤 동기화 (ScrollSpy) 및 스무스 스크롤
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    // 클릭 시 스무스 스크롤
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // 모바일 환경 대응을 위해 스크롤 오프셋 적용
                const headerOffset = window.innerWidth <= 1024 ? 120 : 0;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 스크롤 시 활성 메뉴 업데이트
    window.addEventListener("scroll", () => {
        let currentSectionId = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const headerOffset = window.innerWidth <= 1024 ? 140 : 80;

            if (window.pageYOffset >= sectionTop - headerOffset) {
                currentSectionId = `#${section.getAttribute("id")}`;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === currentSectionId) {
                link.classList.add("active");
            }
        });
    });
});

