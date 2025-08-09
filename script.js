document.addEventListener('DOMContentLoaded', function() {
    // 1. Color Selection Logic
    document.querySelectorAll('.color-thumb').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const parentProduct = this.closest('.product-card');
            
            // Remove active class from all thumbs in this product
            parentProduct.querySelectorAll('.color-thumb').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked thumb
            this.classList.add('active');
            
            // Update main image
            const mainImage = parentProduct.querySelector('.main-product-image');
            mainImage.src = this.dataset.fullImage;
            mainImage.alt = this.dataset.color + ' ' + parentProduct.dataset.product;
        });
    });
    
     let selectedColor = "Red"; // Default color
    
    function changeImage(newImage) {
        // Change main image
        document.getElementById('jordan1-main-image').src = newImage;
        
        // Update selected color (extract from filename)
        selectedColor = newImage.split('-')[1].split('.')[0];
        selectedColor = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1);
        
        // Update border to show selection
        const thumbs = document.querySelectorAll('.color-options img');
        thumbs.forEach(thumb => {
            thumb.style.border = '2px solid #ddd';
            if (thumb.src.includes(selectedColor.toLowerCase())) {
                thumb.style.border = '2px solid #25D366';
            }
        });
    }
    
    function prepareWhatsAppOrder() {
        const productName = "Jordan 1 Retro";
        const price = "₦35,000";
        const whatsappNumber = "254743869564";
        
        const message = `Order Request:%0A%0AProduct: ${productName}%0AColor: ${selectedColor}%0APrice: ${price}%0A%0ASize (please specify):%0AAddress (if delivery):`;
        
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    }
    // 2. WhatsApp Order Generation
    document.querySelectorAll('.whatsapp-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.dataset.product;
            const price = productCard.dataset.price;
            
            // Get selected color
            const selectedThumb = productCard.querySelector('.color-thumb.active');
            const color = selectedThumb ? selectedThumb.dataset.color : 'Not Specified';
            
            // Generate WhatsApp message
            const message = `Order Request:%0A%0AProduct: ${productName}%0AColor: ${color}%0APrice: ${price}%0A%0ASize (please specify):%0AAddress (if delivery):`;
            
            window.open(`https://wa.me/254743869564?text=${message}`, '_blank');
        });
    });
});

// Dynamic Gallery Population
const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid) {
    const shoeImages = [
        'airjordan B loyal.jpg', 'clarks official.jpg', 'dr. martins.jpg', 'empire.jpg',
        'IMG-20250401-WA0001.jpg', 'IMG-20250401-WA0002.jpg', 'IMG-20250401-WA0003.jpg', 'IMG-20250401-WA0004.jpg',
        'IMG-20250401-WA0006.jpg', 'IMG-20250401-WA0007.jpg', 'IMG-20250401-WA0008.jpg', 'IMG-20250401-WA0009.jpg',
        'IMG-20250401-WA0010.jpg', 'IMG-20250401-WA0012.jpg', 'IMG-20250401-WA0013.jpg', 'IMG-20250401-WA0016.jpg',
        'IMG-20250403-WA0172.jpg', 'IMG-20250403-WA0173.jpg', 'IMG-20250403-WA0174.jpg', 'IMG-20250403-WA0175.jpg',
        'IMG-20250406-WA0096.jpg', 'IMG-20250406-WA0097.jpg', 'IMG-20250406-WA0098.jpg', 'IMG-20250406-WA0099.jpg',
        'IMG-20250406-WA0100.jpg', 'IMG-20250406-WA0104.jpg', 'IMG-20250406-WA0116.jpg', 'IMG-20250406-WA0117.jpg',
        'IMG-20250406-WA0118.jpg', 'IMG-20250406-WA0119.jpg', 'IMG-20250406-WA0121.jpg', 'IMG-20250504-WA0332.jpg',
        'IMG-20250504-WA0335.jpg', 'IMG-20250504-WA0336.jpg', 'IMG-20250515-WA0002.jpg', 'IMG-20250515-WA0007.jpg',
        'IMG-20250524-WA0100.jpg', 'IMG-20250524-WA0101.jpg', 'IMG-20250524-WA0102.jpg', 'IMG-20250524-WA0103.jpg',
        'IMG-20250524-WA0118.jpg', 'IMG-20250524-WA0119.jpg', 'IMG-20250524-WA0120.jpg', 'IMG-20250524-WA0121.jpg',
        'IMG-20250524-WA0122.jpg', 'IMG-20250526-WA0451.jpg', 'IMG-20250526-WA0453.jpg', 'IMG-20250526-WA0456.jpg',
        'IMG-20250526-WA0457.jpg', 'IMG-20250526-WA0458.jpg', 'IMG-20250526-WA0459.jpg', 'IMG-20250526-WA0460.jpg',
        'jordan 4.jpg', 'jordan4.jpg', 'mules.jpg', 'naked wolf.jpg', 'nike sb x airjordan 4.jpg', 'shox R4.jpg',
        'WhatsApp Image 2025-05-24 at 14.12.55_698257a6.jpg',
        // Newly added images
        'IMG-20250624-WA0023.jpg', 'IMG-20250624-WA0024.jpg', 'IMG-20250624-WA0025.jpg', 'IMG-20250624-WA0026.jpg',
        'IMG-20250625-WA0183.jpg', 'IMG-20250625-WA0185.jpg', 'IMG-20250625-WA0186.jpg', 'IMG-20250625-WA0187.jpg',
        'IMG-20250625-WA0188.jpg', 'IMG-20250625-WA0189.jpg', 'IMG-20250625-WA0191.jpg', 'IMG-20250625-WA0192.jpg',
        'IMG-20250625-WA0193.jpg', 'IMG-20250625-WA0195.jpg', 'IMG-20250625-WA0196.jpg', 'IMG-20250625-WA0197.jpg',
        'IMG-20250625-WA0198.jpg', 'IMG-20250625-WA0200.jpg', 'IMG-20250625-WA0201.jpg', 'IMG-20250625-WA0202.jpg',
        'IMG-20250625-WA0203.jpg', 'IMG-20250625-WA0204.jpg', 'IMG-20250625-WA0205.jpg', 'IMG-20250625-WA0206.jpg',
        'IMG-20250625-WA0207.jpg', 'IMG-20250625-WA0208.jpg', 'IMG-20250625-WA0209.jpg', 'IMG-20250625-WA0210.jpg',
        'IMG-20250625-WA0211.jpg', 'IMG-20250625-WA0212.jpg', 'IMG-20250625-WA0213.jpg', 'IMG-20250625-WA0214.jpg',
        'IMG-20250625-WA0215.jpg', 'IMG-20250625-WA0216.jpg', 'IMG-20250625-WA0217.jpg', 'IMG-20250625-WA0218.jpg',
        'IMG-20250625-WA0219.jpg', 'IMG-20250625-WA0220.jpg', 'IMG-20250625-WA0221.jpg', 'IMG-20250625-WA0222.jpg',
        'IMG-20250625-WA0223.jpg', 'IMG-20250625-WA0224.jpg', 'IMG-20250625-WA0225.jpg', 'IMG-20250625-WA0226.jpg',
        'IMG-20250625-WA0227.jpg', 'IMG-20250625-WA0228.jpg', 'IMG-20250625-WA0229.jpg', 'IMG-20250625-WA0230.jpg',
        'IMG-20250625-WA0231.jpg', 'IMG-20250625-WA0232.jpg', 'IMG-20250625-WA0233.jpg', 'IMG-20250625-WA0234.jpg',
        'IMG-20250625-WA0235.jpg', 'IMG-20250625-WA0236.jpg', 'IMG-20250625-WA0237.jpg', 'IMG-20250625-WA0238.jpg',
        'IMG-20250625-WA0239.jpg', 'IMG-20250625-WA0240.jpg', 'IMG-20250625-WA0241.jpg', 'IMG-20250625-WA0242.jpg',
        'IMG-20250625-WA0243.jpg', 'IMG-20250625-WA0244.jpg', 'IMG-20250625-WA0245.jpg', 'IMG-20250625-WA0246.jpg',
        'IMG-20250625-WA0247.jpg', 'IMG-20250625-WA0248.jpg', 'IMG-20250625-WA0249.jpg', 'IMG-20250625-WA0250.jpg',
        'IMG-20250625-WA0251.jpg', 'IMG-20250625-WA0252.jpg', 'IMG-20250625-WA0253.jpg', 'IMG-20250625-WA0254.jpg',
        'IMG-20250625-WA0255.jpg', 'IMG-20250625-WA0256.jpg', 'IMG-20250625-WA0257.jpg', 'IMG-20250625-WA0258.jpg',
        'IMG-20250625-WA0259.jpg', 'IMG-20250625-WA0260.jpg', 'IMG-20250625-WA0261.jpg', 'IMG-20250625-WA0262.jpg',
        'IMG-20250625-WA0263.jpg', 'IMG-20250625-WA0264.jpg', 'IMG-20250625-WA0265.jpg', 'IMG-20250625-WA0266.jpg',
        'IMG-20250625-WA0267.jpg', 'IMG-20250625-WA0268.jpg', 'IMG-20250625-WA0269.jpg', 'IMG-20250625-WA0270.jpg',
        'IMG-20250625-WA0271.jpg', 'IMG-20250625-WA0272.jpg', 'IMG-20250625-WA0273.jpg', 'IMG-20250625-WA0274.jpg',
        'IMG-20250625-WA0275.jpg', 'IMG-20250625-WA0281.jpg', 'IMG-20250625-WA0282.jpg', 'IMG-20250625-WA0283.jpg',
        'IMG-20250625-WA0284.jpg'
    ];
    const shoeNames = shoeImages.map((img, i) => {
        // Use a more descriptive name for known images, otherwise use 'Shoe' + (i+1)
        const knownNames = {
            'airjordan B loyal.jpg': 'Air Jordan B Loyal',
            'clarks official.jpg': 'Clarks Official',
            'dr. martins.jpg': 'Dr. Martins',
            'empire.jpg': 'Empire',
            'jordan 4.jpg': 'Jordan 4',
            'jordan4.jpg': 'Jordan 4',
            'mules.jpg': 'Mules',
            'naked wolf.jpg': 'Naked Wolf',
            'nike sb x airjordan 4.jpg': 'Nike SB x Air Jordan 4',
            'shox R4.jpg': 'Shox R4',
        };
        return knownNames[img] || 'Shoe ' + (i + 1);
    });
    shoeImages.forEach((img, i) => {
        if(img.endsWith('.jpg')) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${img}" alt="${shoeNames[i]}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${shoeNames[i]}</h3>
                    <a href="https://wa.me/254743869564?text=I'm%20interested%20in%20${encodeURIComponent(shoeNames[i])}" class="btn">Order Now</a>
                </div>
            `;
            galleryGrid.appendChild(card);
        }
    });
}

// Carousel functionality
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;
function showSlide(idx) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === idx);
    });
}
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
if (prevBtn && nextBtn) {
    prevBtn.onclick = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    };
    nextBtn.onclick = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 4000);
}

// Size guide modal
const openSizeGuide = document.getElementById('openSizeGuide');
const closeSizeGuide = document.getElementById('closeSizeGuide');
const sizeGuide = document.getElementById('sizeGuide');
if (openSizeGuide && closeSizeGuide && sizeGuide) {
    openSizeGuide.onclick = () => { sizeGuide.style.display = 'block'; };
    closeSizeGuide.onclick = () => { sizeGuide.style.display = 'none'; };
}

// Hamburger menu logic
const hamburger = document.getElementById('hamburgerMenu');
const navLinks = document.querySelector('.nav-links');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
if (hamburger && navLinks && mobileNavOverlay) {
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('open');
        mobileNavOverlay.classList.toggle('open');
    });
    mobileNavOverlay.addEventListener('click', function() {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        mobileNavOverlay.classList.remove('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            mobileNavOverlay.classList.remove('open');
        });
    });
}

// Image lazy loading blur removal
function markLoaded(e) {
    e.target.classList.add('loaded');
}
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('load', markLoaded);
});