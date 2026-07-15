/* ==========================================
   Antigravity 2.0 마스터 코스 JS 스크립트
   (아코디언 모션 및 사이드바 내비게이션 스크롤 동기화)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. 아코디언 토글 기능
    const cards = document.querySelectorAll(".week-card");

    cards.forEach((card) => {
        const header = card.querySelector(".card-header");
        const body = card.querySelector(".card-body");

        header.addEventListener("click", () => {
            // 이미 열려있는 카드가 있으면 닫기 (선택사항 - 한 개씩만 열리게 하고 싶다면)
            /*
            cards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('open')) {
                    otherCard.classList.remove('open');
                }
            });
            */

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
