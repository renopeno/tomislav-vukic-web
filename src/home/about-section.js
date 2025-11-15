// PRIVREMENO ISKLJUČENO - testiramo bez about animacija
function initAboutSection() {
  console.log('⚠️ About section animations disabled for debugging');
  return;
}

window.initAboutSection = initAboutSection;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}
