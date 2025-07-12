document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.comparison-slider');

    const setSliderHeight = (slider) => {
        const beforeImage = slider.querySelector('.before-image');
        if (!beforeImage) return;

        const setHeight = () => {
            const naturalWidth = beforeImage.naturalWidth;
            const naturalHeight = beforeImage.naturalHeight;
            if (naturalWidth > 0 && naturalHeight > 0) {
                const sliderWidth = slider.clientWidth;
                const newHeight = (sliderWidth / naturalWidth) * naturalHeight;
                slider.style.height = `${newHeight}px`;
            }
        };
        if (beforeImage.complete) {
            setHeight();
        } else {
            beforeImage.onload = setHeight;
        }
    };
    
    sliders.forEach(slider => {
        let isDragging = false;
        const afterImage = slider.querySelector('.after-image');
        const sliderLine = slider.querySelector('.slider-line');
        const sliderHandle = slider.querySelector('.slider-handle');

        const startDrag = () => { isDragging = true; };
        const stopDrag = () => { isDragging = false; };

        const onDrag = (e) => {
            if (!isDragging) return;
            if (e.cancelable) e.preventDefault(); // Prevent scrolling on touch devices
            
            let clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX === undefined) return;

            const rect = slider.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;
            
            afterImage.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
            sliderLine.style.left = `${percent}%`;
            sliderHandle.style.left = `${percent}%`;
        };
        
        slider.addEventListener('mousedown', startDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('mousemove', onDrag);
        slider.addEventListener('touchstart', startDrag, { passive: true });
        document.addEventListener('touchend', stopDrag);
        document.addEventListener('touchmove', onDrag, { passive: false }); // Use passive: false to allow preventDefault

        setSliderHeight(slider);
    });

    window.addEventListener('resize', () => {
        sliders.forEach(setSliderHeight);
    });
});