document.addEventListener('DOMContentLoaded', () => {
    const dobInput = document.getElementById('dob');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsSection = document.getElementById('results');

    // Set max date to today
    const today = new Date();
    // To handle timezones properly for date input:
    const formattedToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    dobInput.setAttribute('max', formattedToday);

    // Initial check to see if input is already filled
    dobInput.addEventListener('change', () => {
        if (dobInput.value) {
            dobInput.style.borderColor = 'var(--accent-color)';
            dobInput.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.2)';
        }
    });

    calculateBtn.addEventListener('click', () => {
        if (!dobInput.value) {
            // Shake animation for error
            dobInput.closest('.input-group').style.animation = 'shake 0.5s';
            setTimeout(() => {
                dobInput.closest('.input-group').style.animation = '';
            }, 500);
            return;
        }

        const dob = new Date(dobInput.value);
        const now = new Date();

        if (dob > now) {
            alert('Date of birth cannot be in the future.');
            return;
        }

        calculateAgeStats(dob, now);

        // Show results with animation
        resultsSection.classList.remove('hidden');

        // Scroll to results softly
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });

    function calculateAgeStats(dob, now) {
        // 1. Exact Age (Years, Months, Days)
        let years = now.getFullYear() - dob.getFullYear();
        let months = now.getMonth() - dob.getMonth();
        let days = now.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            // Get days in the previous month
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        animateValue(document.getElementById('main-age-display'), years, months, days);

        // 2. Total calculations
        const diffMs = now.getTime() - dob.getTime();
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = (years * 12) + months;

        document.getElementById('total-days').innerText = totalDays.toLocaleString();
        document.getElementById('total-hours').innerText = totalHours.toLocaleString();

        // 3. Next Birthday
        let nextDb = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
        if (nextDb < now) {
            nextDb.setFullYear(now.getFullYear() + 1);
        }

        const nextBdayDiffMs = nextDb.getTime() - now.getTime();
        const nextBdayDays = Math.ceil(nextBdayDiffMs / (1000 * 60 * 60 * 24));

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        if (nextBdayDays === 365 || nextBdayDays === 366 || nextBdayDays === 0) {
            document.getElementById('next-birthday').innerText = `It's Today! 🎉`;
            document.getElementById('next-birthday-countdown').innerText = "Happy Birthday!";
        } else {
            document.getElementById('next-birthday').innerText = `${nextBdayDays} days away`;
            document.getElementById('next-birthday-countdown').innerText = nextDb.toLocaleDateString(undefined, options);
        }

        // 4. Zodiac Sign
        const zodiac = getZodiacSign(dob.getDate(), dob.getMonth() + 1);
        document.getElementById('zodiac-sign').innerText = zodiac;

        // 5. Fun Facts
        document.getElementById('fun-facts').innerHTML = `
            <li>Total Months spanned <span>${totalMonths.toLocaleString()}</span></li>
            <li>Total Weeks passed <span>${totalWeeks.toLocaleString()}</span></li>
            <li>Total Minutes lived <span>${totalMinutes.toLocaleString()}</span></li>
            <li>Earth Orbits Completed <span>${years}</span></li>
        `;
    }

    function animateValue(container, targetYears, targetMonths, targetDays) {
        container.innerHTML = `
            <div class="age-box">
                <span class="value" id="val-years">0</span>
                <span class="label">Years</span>
            </div>
            <div class="age-box">
                <span class="value" id="val-months">0</span>
                <span class="label">Months</span>
            </div>
            <div class="age-box">
                <span class="value" id="val-days">0</span>
                <span class="label">Days</span>
            </div>
        `;

        const easeOutQuad = t => t * (2 - t);
        const duration = 1500;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);

            document.getElementById('val-years').innerText = Math.round(targetYears * progress);
            document.getElementById('val-months').innerText = Math.round(targetMonths * progress);
            document.getElementById('val-days').innerText = Math.round(targetDays * progress);

            if (frame === totalFrames) {
                clearInterval(counter);
                document.getElementById('val-years').innerText = targetYears;
                document.getElementById('val-months').innerText = targetMonths;
                document.getElementById('val-days').innerText = targetDays;
            }
        }, frameRate);
    }

    function getZodiacSign(day, month) {
        if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return "Capricorn ♑";
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius ♒";
        if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces ♓";
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries ♈";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus ♉";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini ♊";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer ♋";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo ♌";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo ♍";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra ♎";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio ♏";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius ♐";
        return "Unknown";
    }
});

// Add keyframes for shake dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;
document.head.appendChild(style);
