// Point the download buttons at the installer of the version in the update list.
// The list is only read here. If it cannot be read, the buttons keep their
// fallback link to the latest release page.
(function () {
  var RELEASES = 'https://github.com/farax-creative/genok-app/releases/download/';
  fetch('update/latest.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (d) {
      var v = String(d.version || '');
      if (!/^\d+\.\d+\.\d+$/.test(v)) return;
      var url = RELEASES + 'v' + v + '/Genok_' + v + '_x64-setup.exe';
      document.querySelectorAll('[data-download]').forEach(function (a) { a.href = url; });
      document.querySelectorAll('[data-version]').forEach(function (s) { s.textContent = 'Version ' + v + ' ·'; });
    })
    .catch(function () {});
})();
