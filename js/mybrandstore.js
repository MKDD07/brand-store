        (function() {
            var tabs = document.querySelectorAll('.tab'),
                panels = document.querySelectorAll('.panel'),
                els = document.querySelectorAll('.reveal');
            var ok = window.gsap && window.ScrollTrigger && !matchMedia('(prefers-reduced-motion:reduce)').matches;
            tabs.forEach(function(t) {
                t.addEventListener('click', function() {
                    var i = +t.dataset.i;
                    tabs.forEach(function(x, j) {
                        x.setAttribute('aria-selected', j === i)
                    });
                    panels.forEach(function(p, j) {
                        p.classList.toggle('on', j === i)
                    });
                    if (ok) gsap.fromTo(panels[i], {
                        opacity: 0,
                        y: 16
                    }, {
                        opacity: 1,
                        y: 0,
                        duration: .4,
                        ease: 'power2.out'
                    });
                })
            });
            document.querySelectorAll('.panel li').forEach(function(li) {
                var i = document.createElement('i');
                i.setAttribute('data-lucide', 'check');
                li.insertBefore(i, li.firstChild)
            });
            if (window.lucide) lucide.createIcons();
            if (window.Swiper) {
                new Swiper('.hero-swiper', {
                    grabCursor: true,
                    loop: true,
                    spaceBetween: 16,
                    a11y: true,
                    autoplay: matchMedia('(prefers-reduced-motion:reduce)').matches ? false : {
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }
                })
                new Swiper('.clients.swiper', {
                    slidesPerView: 2,
                    spaceBetween: 18,
                    loop: true,
                    speed: 4200,
                    autoplay: matchMedia('(prefers-reduced-motion:reduce)').matches ? false : {
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },
                    allowTouchMove: true,
                    breakpoints: {
                        600: { slidesPerView: 3, spaceBetween: 22 },
                        900: { slidesPerView: 5, spaceBetween: 26 },
                        1200: { slidesPerView: 6, spaceBetween: 28 }
                    }
                })
                new Swiper('.why-swiper', {
                    slidesPerView: 1.15,
                    spaceBetween: 16,
                    grabCursor: true,
                    watchOverflow: true,
                    a11y: true,
                    autoplay: matchMedia('(prefers-reduced-motion:reduce)').matches ? false : {
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },
                    breakpoints: {
                        600: { slidesPerView: 2, spaceBetween: 16 },
                        900: { slidesPerView: 3, spaceBetween: 20 },
                        1200: { slidesPerView: 4, spaceBetween: 24 }
                    }
                })
            }
            if (!ok) {
                els.forEach(function(e) {
                    e.classList.add('in')
                })
            } else {
                gsap.registerPlugin(ScrollTrigger);

                ScrollTrigger.batch('.reveal', {
                    start: 'top 90%',
                    once: true,
                    onEnter: function(b) {
                        gsap.to(b, {
                            opacity: 1,
                            y: 0,
                            duration: .8,
                            stagger: .1,
                            ease: 'power3.out'
                        })
                    }
                });

                document.querySelectorAll('[data-count]').forEach(function(el) {
                    var txt = el.textContent.trim(),
                        m = txt.match(/^(\d+)(.*)$/);
                    if (!m || !window.Odometer) return;
                    el.setAttribute('aria-label', txt);
                    el.textContent = '';
                    var o = document.createElement('span'),
                        s = document.createElement('span');
                    s.textContent = m[2];
                    o.setAttribute('aria-hidden', 'true');
                    s.setAttribute('aria-hidden', 'true');
                    el.appendChild(o);
                    el.appendChild(s);
                    var od = new Odometer({
                        el: o,
                        value: Math.pow(10, m[1].length - 1),
                        format: 'd',
                        duration: 2200,
                        theme: 'minimal'
                    });
                    ScrollTrigger.create({
                        trigger: el,
                        start: 'top 92%',
                        once: true,
                        onEnter: function() {
                            od.update(+m[1])
                        }
                    });
                });
            }

            // "One roof. Every channel." GSAP Scroll-Driven Stroke Animation
            initOneRoofStrokeAnimation();

            // Smooth Dropdown Accordion: .6s cubic-bezier(.22, 1, .36, 1)
            initFaqDropdownAnimation();

            function initOneRoofStrokeAnimation() {
                if (!window.gsap || !window.ScrollTrigger) return;

                var strokePaths = document.querySelectorAll('#solutions .stroke-path-draw');
                strokePaths.forEach(function(p) {
                    try {
                        var len = p.getTotalLength ? p.getTotalLength() : 800;
                        p.style.strokeDasharray = len;
                        p.style.strokeDashoffset = len;
                        p.dataset.length = len;
                    } catch(e) {}
                });

                var roofArch = document.querySelector('.roof-arch-path');
                if (roofArch) {
                    var archLen = roofArch.getTotalLength ? roofArch.getTotalLength() : 680;
                    roofArch.style.strokeDasharray = archLen;
                    roofArch.style.strokeDashoffset = archLen;

                    gsap.to(roofArch, {
                        strokeDashoffset: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: "#solutions",
                            start: "top 80%",
                            end: "top 35%",
                            scrub: 1.2
                        }
                    });
                }

                var branchLines = document.querySelectorAll('.channel-branch-line');
                branchLines.forEach(function(bl) {
                    var blLen = bl.getTotalLength ? bl.getTotalLength() : 350;
                    bl.style.strokeDasharray = blLen;
                    bl.style.strokeDashoffset = blLen;

                    gsap.to(bl, {
                        strokeDashoffset: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: "#solutions",
                            start: "top 70%",
                            end: "top 25%",
                            scrub: 1
                        }
                    });
                });

                function animatePanelStrokes(panel) {
                    if (!panel) return;
                    var paths = panel.querySelectorAll('.panel-draw-path');
                    paths.forEach(function(p) {
                        try {
                            var len = p.dataset.length || (p.getTotalLength ? p.getTotalLength() : 600);
                            p.style.strokeDasharray = len;
                            gsap.fromTo(p, {
                                strokeDashoffset: len
                            }, {
                                strokeDashoffset: 0,
                                duration: 1.2,
                                ease: "power3.out"
                            });
                        } catch(e) {}
                    });
                }

                ScrollTrigger.create({
                    trigger: "#solutions .panel.on",
                    start: "top 75%",
                    onEnter: function() {
                        animatePanelStrokes(document.querySelector('#solutions .panel.on'));
                    }
                });

                var tabBtns = document.querySelectorAll('#solutions .tab');
                tabBtns.forEach(function(btn, i) {
                    btn.addEventListener('click', function() {
                        branchLines.forEach(function(bl, bIdx) {
                            bl.classList.toggle('active-branch', bIdx === i);
                        });
                        setTimeout(function() {
                            animatePanelStrokes(document.querySelector('#solutions .panel.on'));
                            if (window.lucide) lucide.createIcons();
                        }, 60);
                    });
                });
            }

            function initFaqDropdownAnimation() {
                var detailsList = document.querySelectorAll('.faq details');
                detailsList.forEach(function(detail) {
                    var summary = detail.querySelector('summary');
                    var body = detail.querySelector('.faq-body');
                    if (!summary || !body) return;

                    if (detail.open) {
                        body.style.height = 'auto';
                    }

                    summary.addEventListener('click', function(e) {
                        e.preventDefault();
                        var isOpen = detail.hasAttribute('open');

                        if (isOpen) {
                            var startHeight = body.scrollHeight;
                            body.style.height = startHeight + 'px';
                            body.style.opacity = '1';
                            body.offsetHeight;

                            gsap.to(body, {
                                height: 0,
                                opacity: 0,
                                duration: 0.6,
                                ease: "power3.out", // corresponds to .6s cubic-bezier(.22, 1, .36, 1)
                                onComplete: function() {
                                    detail.removeAttribute('open');
                                    body.style.height = '';
                                    body.style.opacity = '';
                                }
                            });
                        } else {
                            detail.setAttribute('open', '');
                            var targetHeight = body.scrollHeight;
                            body.style.height = '0px';
                            body.style.opacity = '0';
                            body.offsetHeight;

                            gsap.to(body, {
                                height: targetHeight,
                                opacity: 1,
                                duration: 0.6,
                                ease: "power3.out", // corresponds to .6s cubic-bezier(.22, 1, .36, 1)
                                onComplete: function() {
                                    body.style.height = 'auto';
                                }
                            });
                        }
                    });
                });
            }
            var inquiryForm = document.getElementById('inquiryForm');
            if (inquiryForm) {
                inquiryForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    if (!inquiryForm.checkValidity()) {
                        inquiryForm.classList.add('was-validated');
                        return;
                    }
                    var nameInput = document.getElementById('fullName');
                    var name = nameInput ? nameInput.value.trim() : '';
                    var status = document.getElementById('inquiryFormStatus');
                    if (!status) {
                        status = document.createElement('p');
                        status.id = 'inquiryFormStatus';
                        status.className = 'mt-3 mb-0 fw-semibold text-success';
                        status.setAttribute('role', 'status');
                        inquiryForm.appendChild(status);
                    }
                    status.textContent = 'Thanks' + (name ? ', ' + name : '') + '! Your consultation request has been received.';
                    inquiryForm.classList.remove('was-validated');
                    inquiryForm.reset();
                });
            }

            var legacyForm = document.getElementById('f');
            if (legacyForm) {
                legacyForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    var f = e.target,
                        n = document.getElementById('note');
                    if (!f.n.value.trim() || !/^\S+@\S+\.\S+$/.test(f.e.value)) {
                        if (n) n.textContent = 'Please enter your name and a valid email.';
                        return;
                    }
                    if (n) n.textContent = 'Thanks, ' + f.n.value.trim() + '! We’ll be in touch shortly.';
                    f.reset();
                });
            }
        })();
        (function() {
            function initRewardsMarquee() {
                try {
                    if (window.lucide && typeof lucide.createIcons === 'function') {
                        lucide.createIcons();
                    }

                    if (typeof gsap === 'undefined') return;
                    if (typeof ScrollTrigger !== 'undefined') {
                        gsap.registerPlugin(ScrollTrigger);
                    }

                    var trackUp = document.getElementById('track-up');
                    var trackDown = document.getElementById('track-down');
                    var marqueeContainer = document.getElementById('marquee-container');
                    var startAnimationBtn = document.getElementById('start-animation-btn');

                    if (!trackUp || !trackDown) return;

                    // 1. Clone each column's card set to build a seamless 50% infinite loop
                    [trackUp, trackDown].forEach(function(track) {
                        if (!track) return;
                        var originalSet = track.querySelector('.marquee-set');
                        if (originalSet && track.querySelectorAll('.marquee-set').length < 2) {
                            var duplicateSet = originalSet.cloneNode(true);
                            duplicateSet.setAttribute('aria-hidden', 'true');
                            track.appendChild(duplicateSet);
                        }
                    });

                    // 2. Move each doubled track by exactly one set for a seamless loop.
                    var upSet = trackUp.querySelector('.marquee-set');
                    var downSet = trackDown.querySelector('.marquee-set');
                    if (!upSet || !downSet) return;

                    var upDistance = upSet.getBoundingClientRect().height;
                    var downDistance = downSet.getBoundingClientRect().height;
                    if (!upDistance || !downDistance) return;

                    gsap.set(trackUp, { y: 0 });
                    gsap.set(trackDown, { y: -downDistance });

                    var upTween = gsap.to(trackUp, {
                        y: -upDistance,
                        duration: 16,
                        ease: 'none',
                        repeat: -1
                    });

                    var downTween = gsap.to(trackDown, {
                        y: 0,
                        duration: 16,
                        ease: 'none',
                        repeat: -1
                    });

                    // 3. Smooth hover slowdown (timeScale -> 0.25) on the marquee viewport
                    if (marqueeContainer) {
                        marqueeContainer.addEventListener('mouseenter', function() {
                            gsap.to([upTween, downTween], { timeScale: 0.25, duration: 0.45, ease: 'power2.out' });
                        });

                        marqueeContainer.addEventListener('mouseleave', function() {
                            gsap.to([upTween, downTween], { timeScale: 1, duration: 0.45, ease: 'power2.out' });
                        });
                    }

                    // 4. Staggered entrance animation for text and marquee viewport
                    var entranceTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: '#solutions',
                            start: 'top 82%',
                            once: true
                        }
                    });

                    entranceTl
                        .fromTo(
                            '#solutions .gsap-text',
                            { y: 26, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.72,
                                stagger: 0.12,
                                ease: 'power3.out'
                            }
                        )
                        .fromTo(
                            '#marquee-container',
                            { y: 32, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.8,
                                ease: 'power3.out'
                            },
                            '-=0.45'
                        );

                    // 5. Start/restart the section entrance animation on demand.
                    if (startAnimationBtn) {
                        startAnimationBtn.addEventListener('click', function() {
                            gsap.to([upTween, downTween], { timeScale: 1, duration: 0.35, ease: 'power2.out' });
                            entranceTl.restart();
                            upTween.progress(0);
                            downTween.progress(0);
                        });
                    }
                } catch (error) {
                    console.error('Rewards Marquee initialization error:', error);
                    document.querySelectorAll('#solutions .gsap-text, #marquee-container').forEach(function(el) {
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                    });
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initRewardsMarquee);
            } else {
                initRewardsMarquee();
            }
        })();

        (function() {
            var techProgrammes = {
                gamification: 'Gamification',
                chatbot: 'Chatbot redemption',
                'instant-wins': 'Instant wins',
                'ar-filters': 'Augmented Reality Filters',
                whatsapp: 'WhatsApp redemption',
                'bill-upload': 'Bill upload redemption',
                'qr-code': 'QR code',
                'lucky-draw': 'Lucky draw',
                'punch-card': 'Punch card',
                'scratch-card': 'Virtual scratch card'
            };

            var techProgrammeImages = {
                gamification: 'assets/img/gamifications.png',
                chatbot: 'assets/img/chatbot.gif',
                'instant-wins': 'assets/img/insta_reward.gif',
                'ar-filters': 'assets/img/iPhone 18 Pro - Burgundy Front.jpg'
            };

            function initTechProgrammeSwitcher() {
                var section = document.querySelector('.tech-innovation-section');
                if (!section) return;

                var preview = section.querySelector('#tech-programme-preview');
                var previewImage = preview && preview.querySelector('.tech-programme-preview-image');
                var cards = section.querySelectorAll('.tech-capability-card');
                if (!preview || !cards.length) return;

                function selectProgramme(card) {
                        var link = card.querySelector('[data-tech-programme]');
                        if (!link) return;
                        var programmeKey = link.getAttribute('data-tech-programme');
                        var programme = techProgrammes[programmeKey];
                        if (!programme) return;
                        var image = link.getAttribute('data-tech-image') || techProgrammeImages[programmeKey];
                        preview.style.backgroundImage = image ? 'url("' + encodeURI(image) + '")' : 'none';
                        preview.classList.toggle('has-programme-image', Boolean(image));
                        preview.setAttribute('aria-label', image ? programme + ' preview' : programme + ' image unavailable');
                        if (previewImage) {
                            previewImage.src = image || '';
                            previewImage.alt = image ? programme + ' preview' : '';
                            previewImage.style.display = image ? 'block' : 'none';
                        }
                        cards.forEach(function(item) {
                            var selected = item === card;
                            item.classList.toggle('is-active', selected);
                            item.setAttribute('aria-pressed', selected ? 'true' : 'false');
                        });
                }

                cards.forEach(function(card) {
                    card.setAttribute('role', 'button');
                    card.setAttribute('tabindex', '0');
                    card.addEventListener('click', function(event) {
                        event.preventDefault();
                        selectProgramme(card);
                    });
                    card.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            selectProgramme(card);
                        }
                    });
                });

                selectProgramme(cards[0]);
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initTechProgrammeSwitcher);
            } else {
                initTechProgrammeSwitcher();
            }
        })();

        (function() {
            function initRewardCategoryScroller() {
                var section = document.querySelector('.reward-categories-section');
                if (!section) return;

                var panels = Array.prototype.slice.call(section.querySelectorAll('.reward-category-panel'));
                var image = section.querySelector('.reward-category-visual-image');
                var layout = section.querySelector('.reward-categories-layout');
                var list = section.querySelector('.reward-category-list');
                var visual = section.querySelector('.reward-category-visual');
                var heading = section.querySelector('.reward-categories-heading');
                if (!panels.length || !image || !layout || !list || !visual) return;

                var activePanel = null;
                var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                // Preload local category images for instantaneous transitions
                panels.forEach(function(p) {
                    var imgPath = p.getAttribute('data-image');
                    if (imgPath) {
                        var pre = new Image();
                        pre.src = imgPath;
                    }
                });

                function showPanel(panel) {
                    if (!panel || activePanel === panel) return;
                    activePanel = panel;

                    panels.forEach(function(p) {
                        p.classList.toggle('is-active', p === panel);
                    });

                    var targetSelector = panel.getAttribute('data-target');
                    var targetImage = targetSelector ? section.querySelector(targetSelector) : image;
                    var title = panel.querySelector('h3');
                    var localImage = panel.getAttribute('data-image');
                    if (!targetImage || !localImage) return;

                    if (title) targetImage.setAttribute('alt', title.textContent.trim() + ' rewards');
                    if (targetImage.getAttribute('src') === localImage) return;

                    if (window.gsap && !reducedMotion) {
                        gsap.killTweensOf(targetImage);
                        targetImage.classList.remove('is-changing');
                        targetImage.setAttribute('src', localImage);
                        gsap.fromTo(
                            targetImage,
                            { opacity: 0.25, scale: 0.97, y: 10 },
                            { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }
                        );
                    } else {
                        targetImage.setAttribute('src', localImage);
                    }
                }

                showPanel(panels[0]);

                if (window.gsap && window.ScrollTrigger) {
                    gsap.registerPlugin(ScrollTrigger);

                    if (heading && !reducedMotion) {
                        gsap.fromTo(
                            heading,
                            { y: 24, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.7,
                                ease: 'power3.out',
                                scrollTrigger: {
                                    trigger: section,
                                    start: 'top 82%',
                                    once: true
                                }
                            }
                        );
                    }

                    var mm = gsap.matchMedia();

                    mm.add('(min-width: 701px)', function() {
                        ScrollTrigger.create({
                            trigger: layout,
                            pin: visual,
                            start: 'top top+=110',
                            endTrigger: list,
                            end: 'bottom bottom',
                            pinSpacing: false,
                            anticipatePin: 1,
                            invalidateOnRefresh: true
                        });

                        panels.forEach(function(panel) {
                            ScrollTrigger.create({
                                trigger: panel,
                                start: 'top 55%',
                                end: 'bottom 45%',
                                onEnter: function() { showPanel(panel); },
                                onEnterBack: function() { showPanel(panel); }
                            });
                        });
                    });

                    mm.add('(max-width: 700px)', function() {
                        panels.forEach(function(panel) {
                            ScrollTrigger.create({
                                trigger: panel,
                                start: 'top 62%',
                                end: 'bottom 38%',
                                onEnter: function() { showPanel(panel); },
                                onEnterBack: function() { showPanel(panel); }
                            });
                        });
                    });

                    window.addEventListener('load', function() {
                        ScrollTrigger.refresh();
                    }, { once: true });

                    return;
                }

                if ('IntersectionObserver' in window) {
                    var observer = new IntersectionObserver(function(entries) {
                        entries.forEach(function(entry) {
                            if (entry.isIntersecting) showPanel(entry.target);
                        });
                    }, { rootMargin: '-38% 0px -42% 0px', threshold: 0 });
                    panels.forEach(function(panel) { observer.observe(panel); });
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initRewardCategoryScroller);
            } else {
                initRewardCategoryScroller();
            }
        })();

        (function() {
            function initRewardColliders() {
                var section = document.querySelector('.reward-categories-section');
                var canvas = section && section.querySelector('.reward-colliders-canvas');
                if (!section || !canvas || !window.Matter || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

                var Matter = window.Matter;
                var engine = Matter.Engine.create({ enableSleeping: true });
                var world = engine.world;
                var context = canvas.getContext('2d');
                var bodies = [];
                var walls = [];
                var width = 0;
                var height = 0;
                var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
                var active = true;
                var frame = 0;
                var previousTime = 0;
                var colors = ['rgba(255, 255, 255, .58)', 'rgba(255, 255, 255, .36)', 'rgba(255, 255, 255, .22)'];

                engine.gravity.x = 0;
                engine.gravity.y = 0;
                engine.positionIterations = 7;
                engine.velocityIterations = 5;

                function buildWalls() {
                    if (walls.length) Matter.Composite.remove(world, walls);
                    var thickness = 100;
                    walls = [
                        Matter.Bodies.rectangle(width / 2, -thickness / 2, width + thickness * 2, thickness, { isStatic: true }),
                        Matter.Bodies.rectangle(width / 2, height + thickness / 2, width + thickness * 2, thickness, { isStatic: true }),
                        Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height + thickness * 2, { isStatic: true }),
                        Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + thickness * 2, { isStatic: true })
                    ];
                    Matter.Composite.add(world, walls);
                }

                function resizeCanvas() {
                    var bounds = canvas.getBoundingClientRect();
                    width = Math.max(1, bounds.width);
                    height = Math.max(1, bounds.height);
                    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
                    canvas.width = Math.round(width * pixelRatio);
                    canvas.height = Math.round(height * pixelRatio);
                    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                    buildWalls();

                    bodies.forEach(function(body) {
                        var radius = body.circleRadius || 20;
                        Matter.Body.setPosition(body, {
                            x: Math.max(radius, Math.min(width - radius, body.position.x)),
                            y: Math.max(radius, Math.min(height - radius, body.position.y))
                        });
                    });
                }

                function createCircles() {
                    var count = Math.max(16, Math.min(28, Math.round(width / 48)));
                    for (var i = 0; i < count; i++) {
                        var radius = 9 + Math.random() * 19;
                        var body = Matter.Bodies.circle(
                            radius + Math.random() * Math.max(1, width - radius * 2),
                            radius + Math.random() * Math.max(1, height - radius * 2),
                            radius,
                            { restitution: .96, friction: .001, frictionAir: .001, density: .001 }
                        );
                        body.renderColor = colors[i % colors.length];
                        Matter.Body.setVelocity(body, { x: (Math.random() - .5) * 2.2, y: (Math.random() - .5) * 2.2 });
                        bodies.push(body);
                    }
                    Matter.Composite.add(world, bodies);
                }

                function draw() {
                    context.clearRect(0, 0, width, height);
                    bodies.forEach(function(body) {
                        var radius = body.circleRadius || 18;
                        context.beginPath();
                        context.arc(body.position.x, body.position.y, radius, 0, Math.PI * 2);
                        context.fillStyle = body.renderColor;
                        context.fill();
                        context.lineWidth = 1;
                        context.strokeStyle = 'rgba(255, 255, 255, .18)';
                        context.stroke();
                    });
                }

                function animate(time) {
                    frame = 0;
                    if (!active) return;
                    var delta = previousTime ? Math.min(time - previousTime, 32) : 16.67;
                    previousTime = time;
                    Matter.Engine.update(engine, delta);
                    draw();
                    frame = window.requestAnimationFrame(animate);
                }

                function start() {
                    if (!frame) {
                        previousTime = 0;
                        frame = window.requestAnimationFrame(animate);
                    }
                }

                resizeCanvas();
                createCircles();
                draw();
                window.addEventListener('resize', resizeCanvas, { passive: true });

                if ('IntersectionObserver' in window) {
                    var observer = new IntersectionObserver(function(entries) {
                        active = entries[0].isIntersecting;
                        canvas.classList.toggle('is-active', active);
                        if (active) start();
                    }, { threshold: 0 });
                    observer.observe(section);
                    active = false;
                } else {
                    canvas.classList.add('is-active');
                    start();
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initRewardColliders);
            } else {
                initRewardColliders();
            }
        })();

document.querySelectorAll('#platform .accordion').forEach((group) => {
    const items = group.querySelectorAll('details');
    items.forEach((item) => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                items.forEach((other) => {
                    if (other !== item) other.open = false;
                });
            }
        });
    });
});
