if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;

        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

var Radzen = {
    uploads: function (uploadComponent, id) {
        if (!Radzen.uploadComponents) {
            Radzen.uploadComponents = {};
        }
        Radzen.uploadComponents[id] = uploadComponent;
    },
    upload: function (fileInput, url, multiple) {
        var data = new FormData();
        var files = [];
        for (var i = 0; i < fileInput.files.length; i++) {
            var file = fileInput.files[i];
            data.append(multiple ? 'files' : 'file', file, file.name);
            files.push({ Name: file.name, Size: file.size });
        }
        var xhr = new XMLHttpRequest();
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                var uploadComponent = Radzen.uploadComponents && Radzen.uploadComponents[fileInput.id];
                if (uploadComponent) {
                    var progress = parseInt((e.loaded / e.total) * 100);
                    uploadComponent.invokeMethodAsync("RadzenUpload.OnProgress", progress, e.loaded, e.total, files);
                }
            }
        };
        xhr.open('POST', url, true);
        xhr.send(data);
    },
    getCookie : function (name) {
        var value = "; " + decodeURIComponent(document.cookie);
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    },
    getCulture: function() {
        var cultureCookie = Radzen.getCookie(".AspNetCore.Culture");
        var uiCulture = cultureCookie ? cultureCookie.split('|').pop().split('=').pop() : null;
        return uiCulture || 'en-US';
    },
    numericOnPaste: function (e) {
        if (e.clipboardData) {
          var value = e.clipboardData.getData('text');

          if (value && /^-?\d*\.?\d*$/.test(value)) {
            return;
          }

          e.preventDefault();
        }
    },
    numericKeyPress: function (e) {
        if (e.metaKey || e.ctrlKey || e.keyCode == 9 || e.keyCode == 8 || e.keyCode == 13) {
            return;
        }

        var ch = String.fromCharCode(e.charCode);

        if (/^[-\d,.]$/.test(ch)) {
            return;
        }

        e.preventDefault();
    },
    openPopup: function(parent, id, syncWidth) {
        var popup = document.getElementById(id);
        var parentRect = parent.getBoundingClientRect();

        var scrollLeft = document.documentElement.scrollLeft
        var scrollTop = document.documentElement.scrollTop;

        var top = parentRect.bottom + scrollTop;
        var left = parentRect.left + scrollLeft;
        var width = parentRect.width;

        if (syncWidth) {
            popup.style.width = width + 'px';
        }

        popup.style.display = 'block';

        var rect = popup.getBoundingClientRect();

        if (top + rect.height > window.innerHeight && parentRect.top > rect.height) {
            top = parentRect.top - rect.height + scrollTop;
        }

        if (left + rect.width - scrollLeft > window.innerWidth && window.innerWidth > rect.width) {
            left = window.innerWidth - rect.width + scrollLeft;
        }

        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
        popup.style.zIndex = 1000;

        Radzen[id] = function (e) {
            if (!parent.contains(e.target) && !popup.contains(e.target)) {
                Radzen.closePopup(id);
            }
        }

        document.body.appendChild(popup);
        document.addEventListener('click', Radzen[id]);
        document.addEventListener("scroll", Radzen[id], true);
    },
    closePopup: function(id) {
        var popup = document.getElementById(id);
        popup.style.display = 'none';
        document.removeEventListener('click', Radzen[id]);
        document.removeEventListener("scroll", Radzen[id]);
    },
    togglePopup: function(parent, id, syncWidth) {
        var popup = document.getElementById(id);

        if (popup.style.display == 'block') {
            Radzen.closePopup(id);
        } else {
            Radzen.openPopup(parent, id, syncWidth);
        }
    }, 
    destroyPopup: function(id) {
        var popup = document.getElementById(id);
        popup.parentNode.removeChild(popup);
        document.removeEventListener('click', Radzen[id]);
        document.removeEventListener("scroll", Radzen[id]);
    },
    scrollDataGrid: function (e) {
        var scrollLeft = (e.target.scrollLeft ? '-' + e.target.scrollLeft : 0) + 'px';

        e.target.previousElementSibling.style.marginLeft = scrollLeft;

        if (e.target.nextElementSibling) {
            e.target.nextElementSibling.style.marginLeft = scrollLeft;
        }
    },
    openDialog: function () {
        document.body.classList.add('no-scroll');
    },
    closeDialog: function () {
        document.body.classList.remove('no-scroll');
    },
    getInputValue: function (arg) {
        var input = (arg instanceof Element || arg instanceof HTMLDocument) ? arg : document.getElementById(arg);
        return input ? input.value : '';
    },
    setInputValue: function (arg,value) {
        var input = (arg instanceof Element || arg instanceof HTMLDocument) ? arg : document.getElementById(arg);
        if (input) {
            input.value = value;
        }
    },
    readFileAsBase64: function (fileInput, maxFileSize) {
        var readAsDataURL = function (fileInput) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onerror = function () {
                    reader.abort();
                    reject("Error reading file.");
                };
                reader.addEventListener("load", function () {
                    resolve(reader.result);
                }, false);
                var file = fileInput.files[0];
                if (file.size <= maxFileSize) {
                    reader.readAsDataURL(file);
                } else {
                    reject("File too large.");
                }
            });
        };

        return readAsDataURL(fileInput);
    },
    closeMenuItems: function (event) {
        var menu = event.target.closest('.menu');

        if (!menu) {
            var targets = document.querySelectorAll('.navigation-item-wrapper-active');

            if (targets) {
                for (var i = 0; i < targets.length; i++) {
                    Radzen.toggleMenuItem(targets[i], false);
                }
            }
            document.removeEventListener('click', Radzen.closeMenuItems);
        }
    },
    closeOtherMenuItems: function (current) {
        var targets = document.querySelectorAll('.navigation-item-wrapper-active');
        if (targets) {
            for (var i = 0; i < targets.length; i++) {
                var target = targets[i];
                var item = target.closest('.navigation-item');

                if (!current || !item.contains(current)) {
                    Radzen.toggleMenuItem(target, false);
                }
            }
        }
    },
    toggleMenuItem: function (target, selected) {
        Radzen.closeOtherMenuItems(target);

        var item = target.closest(".navigation-item");

        if (selected === undefined) {
            selected = !item.classList.contains('navigation-item-active');
        }

        item.classList.toggle('navigation-item-active', selected);

        target.classList.toggle('navigation-item-wrapper-active', selected)

        var children = item.querySelector('.navigation-menu');

        if (children) {
            children.style.display = selected ? '' : 'none';
        } else if (selected) {
            Radzen.closeOtherMenuItems(null);
        }

        var icon = item.querySelector('.navigation-item-icon-children');

        if (icon) {
            var deg = selected ? '180deg' : 0;
            icon.style.transform = 'rotate(' + deg + ')';
        }

        document.removeEventListener('click', Radzen.closeMenuItems);
        document.addEventListener('click', Radzen.closeMenuItems);
    }
};