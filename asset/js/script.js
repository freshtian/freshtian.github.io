

document.addEventListener('DOMContentLoaded', function () {

    const loader = document.getElementById("loader");
    const loadingText = document.getElementById("loading-text");
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        loadingText.style.setProperty('background', `linear-gradient(to right, white ${progress}%, #2980b9 ${progress}%)`);
        loadingText.style.setProperty('-webkit-background-clip', 'text');
        loadingText.style.setProperty('background-clip', 'text');
        loadingText.style.setProperty('color', 'transparent');
        if (progress >= 100) {
            clearInterval(interval);
            loadingText.classList.add('moved');
        }
    }, 60);


    const contentArea = document.getElementById('contentArea');
    const allDivs = contentArea.children;
    const contents = {
        "mainContent": document.querySelectorAll('#mainContent .content'),
        "reminiscenceContent": document.querySelectorAll('#reminiscenceContent .content'),
        "galleryContent": document.querySelectorAll('#galleryContent .content')
    };

    let currentContentKey = 'mainContent';
    let currentSectionIndex = 0;
    let isTransitioning = false;
    let timeout;
    let timeoutSession;

    document.getElementById('mainButton').addEventListener('click', () => switchContent('mainContent'));
    document.getElementById('reminiscenceButton').addEventListener('click', () => switchContent('reminiscenceContent'));
    document.getElementById('galleryButton').addEventListener('click', () => switchContent('galleryContent'));

    Object.values(contents).forEach((content) => {
        content.forEach((section) => {
            section.addEventListener('transitionend', () => {
                isTransitioning = false;
                // console.log(section.id + " transition ended");
            });
            section.addEventListener('transitionstart', () => {
                isTransitioning = true;
                // console.log(section.id + " transition started");
            });
        });
    });

    function updateContent(nextKey) {
        // console.log("Next key: " + nextKey + " Current key: " + currentContentKey);
        let sections = contents[currentContentKey];
        // isTransitioning = true;
        const sidebar = document.querySelector('.sidebar');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        let background;
        let textOverlay;
        if(nextKey !== currentContentKey){
            background = sections[currentSectionIndex].querySelector('.background-image');
            background.zIndex = -51;
            textOverlay = sections[currentSectionIndex].querySelector('.text-overlay');
            background.style.opacity = 0;
            textOverlay.style.opacity = 0;
            textOverlay.style.visibility = 'hidden';
            textOverlay.style.transform = "translateY(0%)";
            if(timeout){
                console.log("Clearing timeout " + timeout);
                clearTimeout(timeout);
                timeout = null;
                if(timeoutSession){
                    document.getElementById(timeoutSession).style.display = 'none';
                    timeoutSession = null;
                    if(isTransitioning){
                        isTransitioning = false;
                    }
                }
            }
            timeoutSession = currentContentKey;
            timeout = setTimeout(() => {
                if(timeoutSession){
                    document.getElementById(timeoutSession).style.display = 'none';
                    if(isTransitioning){
                        isTransitioning = false;
                    }
                }
                timeout = null;
                timeoutSession = null;
            }, 0);
            currentContentKey = nextKey;
            currentSectionIndex = 0;
            sections = contents[currentContentKey];
            Array.from(allDivs).forEach(div => {
                if (div.id === nextKey) {
                    div.style.display = 'block';
                } 
            });
        }

        sections.forEach((section, index) => {
            background = section.querySelector('.background-image');
            textOverlay = section.querySelector('.text-overlay');
            if (index === currentSectionIndex) {
                background.zIndex = -50;
                background.style.opacity = 0.9;
                textOverlay.style.opacity = 0.9;
                textOverlay.style.visibility = 'visible';
                textOverlay.style.transform = "translateY(0%)";
            } else {
                background.zIndex = -51;
                background.style.opacity = 0;
                textOverlay.style.opacity = 0;
                textOverlay.style.visibility = 'hidden';
                textOverlay.style.transform = "translateY(0%)";
            }
        });

        if(currentSectionIndex >= sections.length - 1) {
            sidebar.style.opacity = 0;
            sidebar.style.visibility = "hidden";
            sidebar.style.transform = "translateY(-30%)";
            header.style.opacity = 0;
            footer.style.opacity = 0;
            const buttons = document.querySelectorAll('header button');
            buttons.forEach(function(button) {
                button.disabled = true;
            });
        } else {
            sidebar.style.transform = "translateY(0)";
            sidebar.style.visibility = "visible";
            sidebar.style.opacity = 1;
            header.style.opacity = 1;
            footer.style.opacity = 1;
            const buttons = document.querySelectorAll('header button');
            buttons.forEach(function(button) {
                button.disabled = false;
            });
        }
    }

    function switchContent(newContentKey) {
        if (isTransitioning) {
            console.log("Transitioning");
            return;
        }
        updateContent(newContentKey);
        // isTransitioning = false;
    }

    document.addEventListener('wheel', function (event) {
        if (isTransitioning) {
            console.log("Transitioning");
            return;
        }

        const direction = event.deltaY > 0 ? 'down' : 'up';
        const sections = contents[currentContentKey];

        if (direction === 'down' && currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
        } else if (direction === 'up' && currentSectionIndex > 0) {
            currentSectionIndex--;
        } else return;

        updateContent(currentContentKey);
    });
    // setTimeout(() => {
    //     sections.forEach((section, index) => {
    //         const content = section.querySelector('.text-overlay');

    //         if (index === currentSectionIndex) {
    //             content.style.overflow = 'visible';
    //         } else {
    //             content.style.overflow = 'hidden';
    //         }
    //     });
    // }, 1000);

/*
        (function () {
            var colors = ["#06BC59", "#67289B", "#1B9738", "#0D1DA9"];
            characters = ["☆", "★"];
            elementGroup = [];

            class Element {

                constructor() {
                    num = Math.floor(Math.random() * characters.length);
                    this.character = characters[num];
                    this.lifeSpan = 120;
                    this.initialStyles = {
                        position: "fixed",
                        top: "0",
                        display: "block",
                        pointerEvents: "none",
                        "z-index": "10000000",
                        fontSize: "25px",
                        "will-change": "transform",
                        color: "#000000"
                    };

                    this.init = function (x, y, color) {
                        this.velocity = { x: (Math.random() < .5 ? -1 : 1) * (Math.random() / 2), y: 1 };
                        this.position = { x: x - 10, y: y - 20 };
                        this.initialStyles.color = color;
                        this.element = document.createElement("span");
                        this.element.innerHTML = this.character;
                        ApplyStyle(this.element, this.initialStyles);
                        this.update();
                        document.body.appendChild(this.element);
                    };

                    this.update = function () {

                        this.position.x += this.velocity.x;
                        this.position.y += this.velocity.y;
                        this.lifeSpan--;
                        this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + this.lifeSpan / 120 + ")";
                    };

                    this.die = function () {
                        this.element.parentNode.removeChild(this.element);
                    };
                }
            }

            AddListener();
            setInterval(
                function () {
                    Rander();
                },
                1000 / 60);
            function AddListener() {
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("touchmove", Touch);
                document.addEventListener("touchstart", Touch);
            }
            function Rander() {
                for (var i = 0; i < elementGroup.length; i++) {
                    elementGroup[i].update();
                    if (elementGroup[i].lifeSpan < 0) {
                        elementGroup[i].die();
                        elementGroup.splice(i, 1);
                    }
                }
            }
            function onMouseMove(t) {
                num = Math.floor(Math.random() * colors.length);
                CreateElement(t.clientX, t.clientY, colors[num]);
            }
            function CreateElement(x, y, color) {
                var e = new Element;
                e.init(x, y, color);
                elementGroup.push(e);
            }
            function ApplyStyle(element, style) {
                for (var i in style) {
                    element.style[i] = style[i];
                }
            }
            function Touch(t) {
                if (t.touches.length > 0) {
                    for (var i = 0; i < t.touches.length; i++) {
                        num = Math.floor(Math.random() * r.length);
                        s(t.touches[i].clientX, t.touches[i].clientY, r[num]);
                    }
                }
            }
        })();
 */
});

