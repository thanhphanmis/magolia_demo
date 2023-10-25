import "@babel/polyfill";
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';
import 'bootstrap'
import GLightbox from 'glightbox'
import { removeItemFromArray, loadGoogleMapsApi } from "../../global/utils";
import 'glightbox/dist/css/glightbox.css'
import '../../styles/main.scss'
import 'header'
import 'footer'
import 'breadcrumb'
import 'card'
import 'subscribe'
import 'teamMember'
import 'hero'
import 'actionBar'
import 'deal-hero-carousel'
import 'deal-week-carousel'
import 'search-panel'
import 'search-flight'
import 'select-custom'
import 'input-custom'
import 'banner'
import 'accordion'
import 'visitStore'
import 'socialImages'
import 'extras'
import 'simple-image'
import 'brochure-grid'
import 'modals'
import './style.scss'

$(function () {
    (async () => {
        await new loadGoogleMapsApi();
    })();
    const customLightboxHTML = `
        <div id="glightbox-body" class="glightbox-container">
            <div class="gloader visible"></div>
            <div class="goverlay"></div>
            <div class="gcontainer">
                <div id="glightbox-slider" class="gslider"></div>
                <button class="gnext gbtn" tabindex="0" aria-label="Next"></button>
                <button class="gprev gbtn" tabindex="1" aria-label="Previous"></button>
            </div>
        </div>`;


    let customSlideHTML = `
        <div class="gslide">
            <div class="gslide-inner-content">
                <div class="gheader"></div>
                <div class="ginner-container container">
                    <div class="gslide-media">
                        <div class="gpagination">
                            <span class="gpagination--current"></span> / <span class="gpagination--total"></span>
                        </div>
                        <button class="gclose gbtn" tabindex="2" aria-label="Close"><svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.2005 4.30713C12.0759 4.18229 11.9068 4.11214 11.7305 4.11214C11.5541 4.11214 11.385 4.18229 11.2605 4.30713L8.00047 7.56046L4.74047 4.30046C4.61591 4.17562 4.44681 4.10547 4.27047 4.10547C4.09412 4.10547 3.92502 4.17562 3.80047 4.30046C3.54047 4.56046 3.54047 4.98046 3.80047 5.24046L7.06047 8.50046L3.80047 11.7605C3.54047 12.0205 3.54047 12.4405 3.80047 12.7005C4.06047 12.9605 4.48047 12.9605 4.74047 12.7005L8.00047 9.44046L11.2605 12.7005C11.5205 12.9605 11.9405 12.9605 12.2005 12.7005C12.4605 12.4405 12.4605 12.0205 12.2005 11.7605L8.94047 8.50046L12.2005 5.24046C12.4538 4.98713 12.4538 4.56046 12.2005 4.30713Z" fill="white"/></svg></button>
                        <button class="gprev gbtn" tabindex="1" aria-label="Previous"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="20" fill="#E0F7FC"/><path d="M23.0005 25.2892C23.3905 24.8992 23.3905 24.2692 23.0005 23.8792L19.1205 19.9992L23.0005 16.1192C23.3905 15.7292 23.3905 15.0992 23.0005 14.7092C22.6105 14.3192 21.9805 14.3192 21.5905 14.7092L17.0005 19.2992C16.6105 19.6892 16.6105 20.3192 17.0005 20.7092L21.5905 25.2992C21.9705 25.6792 22.6105 25.6792 23.0005 25.2892Z" fill="#141415 !important"/></svg></button>
                        <button class="gnext gbtn" tabindex="0" aria-label="Next"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="20" fill="#E0F7FC"/><path d="M16.9995 14.7108C16.6095 15.1008 16.6095 15.7308 16.9995 16.1208L20.8795 20.0008L16.9995 23.8808C16.6095 24.2708 16.6095 24.9008 16.9995 25.2908C17.3895 25.6808 18.0195 25.6808 18.4095 25.2908L22.9995 20.7008C23.3895 20.3108 23.3895 19.6808 22.9995 19.2908L18.4095 14.7008C18.0295 14.3208 17.3895 14.3208 16.9995 14.7108Z" fill="#141415"/></svg></button>
                    </div>
                </div>
            </div>
        </div>`;

    const lightbox = GLightbox({
        touchNavigation: true,
        autoplayVideos: true,
        lightboxHTML: customLightboxHTML,
        slideHTML: customSlideHTML,
        closeButton: false,
        onOpen: () => {
            if(typeof window.glightboxOpen === 'function') {
                window.glightboxOpen();
            }

            $("button.gclose").on("click", function() {
                lightbox.close(); // Close the lightbox
            })

            $("button.gnext").on("click", function() {
                lightbox.nextSlide(); // Close the lightbox
            })

            $("button.gprev").on("click", function() {
                lightbox.prevSlide(); // Close the lightbox
            })
        },
        beforeSlideLoad: (slide, data) => {
        },

    });
    lightbox.on('slide_changed', ({ prev, current }) => {
        // Prev and current are objects that contain the following data
        const { slideIndex } = current;
        $('.gpagination--current').text(slideIndex+1);
        $('.gpagination--total').text($('.gslide').length);
    });

    const $showMoreLess = $('[data-show-more-less]');
    const btn = $showMoreLess.find('[data-btn]');
    const dots = $showMoreLess.find('.dots');
    const moreText = $showMoreLess.find('.more-text');

    btn.on('click', function () {
      if (dots.css("display") === "none") {
        dots.css("display", "inline");
        btn.text("Read more");
        moreText.css("display", "none");
      } else {
        dots.css("display", "none");
        btn.text("Read less");
        moreText.css("display", "inline");
      }
    });

    function extractElementIso(els) {
        return Array.from(els).map((entry, index) => ({
            filters: '',
            sortArr: [],
            index,
            gridId: `.grid[data-id="${entry.dataset.id}"]`,
            options: {
                itemSelector: `.grid[data-id="${entry.dataset.id}"] .grid-item`,
                layoutMode: `fitRows`,
                percentPosition: true,
                fitRows: {
                    gutter: `.grid[data-id="${entry.dataset.id}"] .gutter-sizer`
                }
            }
        }));
    }
    // Tab filter
    let isotopeConfigs = [];
    const grids = document.querySelectorAll('.grid');
    imagesLoaded(grids, function() {
        isotopeConfigs = extractElementIso(grids);
        window.filtersIsotop = isotopeConfigs;
        window.isotopeInstances = isotopeConfigs.map(config => {
            const gridElement = document.querySelector(config.gridId);
            gridElement.classList.remove('unset');
            if (gridElement) gridElement.setAttribute('data-index', config.index);
            return new Isotope(gridElement, config.options);
        });
    }) 

    function combineSelectors(filters, sortArr) {
        var combinedSelectors = [];
        if (sortArr.length) {
            for (var i = 0; i < sortArr.length; i++) {
                combinedSelectors.push(filters + sortArr[i]);
            }
        } else {
            combinedSelectors.push(filters);
        }
        
        return combinedSelectors.join(', ');
    }

    $('.js-filter-partner').on('click', function(e) {
        e.preventDefault();
        const el = $(this);
        const parentSection = el.closest('section');
        // get index
        const index = parentSection.find('.grid').data('index');
        // fitler by group
        const dataTarget = el.attr('data-target');
        const isGridIsotope = parentSection.find('.grid').length;
        if (el.hasClass('sort')) {
            if (el.hasClass('active')) {
                el.removeClass('active');
                if (isGridIsotope) window.filtersIsotop[index].sortArr = removeItemFromArray(window.filtersIsotop[index].sortArr, dataTarget)
            } else {
                el.addClass('active');
                if (isGridIsotope) window.filtersIsotop[index].sortArr.push(dataTarget);
            }
        } else {
            el.closest('.nav-item').siblings('.nav-item').find('.js-filter-partner').removeClass('active');
            el.addClass('active');

            if (isGridIsotope) window.filtersIsotop[index].filters = dataTarget;
        }
        if (isGridIsotope) {
            const filterValue = combineSelectors(window.filtersIsotop[index].filters, window.filtersIsotop[index].sortArr);
            window.isotopeInstances[index].arrange({
                filter: filterValue
            }); 
        }  
    });


    let gridItems = $('.grid-item');
    let tabItems = $('.js-filter-partner');
    let list = [];
    if(gridItems.length > 0) {
        for(let i = 0; i < gridItems.length; i++) {
            if(gridItems[i].classList.length > 0) {
                for(let j = 0; j < gridItems[i].classList.length ;j++) {
                    if(!list.includes(gridItems[i].classList[j])) {
                        list.push(gridItems[i].classList[j])
    
                    }
                }
            }
        }
    }
    if(tabItems.length > 0) {
        for(let i = 0; i < tabItems.length; i++) {
            let attr = $(tabItems[i]).attr('data-target').replace('.','');
            if(attr !== '*' && !list.includes(attr)){
                $(tabItems[i]).closest('.nav-item').addClass('d-none');
            }
        }
    }
});
