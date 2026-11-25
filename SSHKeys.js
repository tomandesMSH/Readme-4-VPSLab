(function(){
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('nav.toc a'));
  var sections = tocLinks.map(function(a){
    return document.getElementById(a.getAttribute('href').slice(1));
  }).filter(Boolean);

  function setActive(id){
    tocLinks.forEach(function(a){
      a.parentElement.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  if('IntersectionObserver' in window && sections.length){
    var current = sections[0].id;
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          current = entry.target.id;
        }
      });
      setActive(current);
    }, {
      rootMargin: '-15% 0px -70% 0px',
      threshold: 0
    });
    sections.forEach(function(s){ observer.observe(s); });
    setActive(current);
  }
})();

(function(){
  var svg = function(inner){ return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>'; };
  var COPY_ICON = svg('<rect x="9" y="9" width="12" height="12" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>');
  var CHECK_ICON = svg('<polyline points="20 6 9 17 4 12"></polyline>');
  var WIN_ICON = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 3h8.4v8.4H3V3zm9.6 0H21v8.4h-8.4V3zM3 12.6h8.4V21H3v-8.4zm9.6 0H21V21h-8.4v-8.4z"></path></svg>';
  var LINUX_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 10c-1.3 2-2 4.3-2 6.8 0 3.3 2.4 5.2 5.7 5.2s5.7-1.9 5.7-5.2c0-2.5-.7-4.8-2-6.8-1.1-.7-2.3-1-3.7-1s-2.6.3-3.7 1z" fill="currentColor"></path><circle cx="12" cy="6.8" r="3.6" fill="currentColor"></circle><path d="M9.4 12.8c-.6 1.4-.9 3-.9 4.4 0 2.2 1.4 3.6 3.5 3.6s3.5-1.4 3.5-3.6c0-1.4-.3-3-.9-4.4-.8-.5-1.6-.7-2.6-.7s-1.8.2-2.6.7z" style="fill:var(--code-bg)"></path><circle cx="10.2" cy="6.3" r="0.75" style="fill:var(--code-bg)"></circle><circle cx="13.8" cy="6.3" r="0.75" style="fill:var(--code-bg)"></circle><path d="M11.1 8.5h1.8l-.9 1.1z" fill="#f2a93b"></path><ellipse cx="9" cy="21.6" rx="1.3" ry="0.7" fill="#f2a93b"></ellipse><ellipse cx="15" cy="21.6" rx="1.3" ry="0.7" fill="#f2a93b"></ellipse></svg>';

  var OS_BY_LANG = {
    powershell: {cls:'win', icon:WIN_ICON, label:'Windows'},
    ini: {cls:'win', icon:WIN_ICON, label:'Windows'},
    bash: {cls:'linux', icon:LINUX_ICON, label:'Linux'}
  };

  document.querySelectorAll('.codeblock').forEach(function(block){
    var bar = block.querySelector('.bar');
    var pre = block.querySelector('pre');
    var tag = block.querySelector('.tag');
    var icons = block.querySelector('.icons');
    if(!bar || !pre) return;

    var lang = block.getAttribute('data-lang') || 'shell';
    if(lang === 'output'){
      tag.innerHTML = '<span class="output-tag">Výstup</span>';
      return;
    }
    var os = OS_BY_LANG[lang] || {cls:'win', icon:WIN_ICON, label:'Windows'};
    tag.innerHTML = '<span class="os-badge ' + os.cls + '">' + os.icon + '<span>' + os.label + '</span></span>';

    var copyBtn = document.createElement('button');
    copyBtn.className = 'icon-btn';
    copyBtn.type = 'button';
    copyBtn.setAttribute('aria-label', 'Zkopírovat');
    copyBtn.innerHTML = COPY_ICON;
    copyBtn.addEventListener('click', function(){
      var text = pre.textContent;
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(function(){
          copyBtn.innerHTML = CHECK_ICON;
          copyBtn.classList.add('copied');
          setTimeout(function(){
            copyBtn.innerHTML = COPY_ICON;
            copyBtn.classList.remove('copied');
          }, 1300);
        }).catch(function(){});
      }
    });

    icons.appendChild(copyBtn);
  });
})();
