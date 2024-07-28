

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.content');
    let currentSectionIndex = 0;
    let isTransitioning = false;

    document.addEventListener('wheel', function (event) {

        if (isTransitioning) return;

        const direction = event.deltaY > 0 ? 'down' : 'up';

        if (direction === 'down' && currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
        } else if (direction === 'up' && currentSectionIndex > 0) {
            currentSectionIndex--;
        } else return;

        updateContent();
    });

    sections.forEach((section) => {
        section.addEventListener('transitionend', () => {
            isTransitioning = false;
        });
    });

    function updateContent() {
    	  isTransitioning = true;
    	  const sidebar = document.querySelector('.sidebar');
    	  const header = document.querySelector('header');
    	  const footer = document.querySelector('footer');

        sections.forEach((section, index) => {
            const background = section.querySelector('.background-image');
            const textOverlay = section.querySelector('.text-overlay');
            const content = section.querySelector('.content');

            if (index === currentSectionIndex) {
                background.style.opacity = 0.9;
                textOverlay.style.opacity = 1;
                textOverlay.style.visibility = 'visible';
                textOverlay.style.transform = "translateY(0%)";
            } else {
                background.style.opacity = 0;
                textOverlay.style.opacity = 0;
                textOverlay.style.visibility = 'visible';
                textOverlay.style.transform = "translateY(5%)";
            }
        });
        
//        if(currentSectionIndex === 0){
//        	  document.getElementById('githubLink').style.pointerEvents = 'auto';
//        } else {
//        	  document.getElementById('githubLink').style.pointerEvents = 'none';
//        }
        
        if(currentSectionIndex >= 3) {
        	  sidebar.style.opacity = 0;
        	  sidebar.style.visibility = "hidden";
        	  sidebar.style.transform = "translateY(-30%)";
        	  header.style.opacity = 0;
        	  footer.style.opacity = 0;
        } else {
        	  sidebar.style.transform = "translateY(0)";
        	  sidebar.style.visibility = "visible";
        	  sidebar.style.opacity = 1;
        	  header.style.opacity = 1;
        	  footer.style.opacity = 1;
        }
    }

    setTimeout(() => {
        sections.forEach((section, index) => {
            const content = section.querySelector('.text-overlay');

            if (index === currentSectionIndex) {
                content.style.overflow = 'visible';
            } else {
                content.style.overflow = 'hidden';
            }
        });
    }, 1000);
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

