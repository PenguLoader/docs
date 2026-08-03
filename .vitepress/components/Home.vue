<template>
  <main class="p-home">
    <div :class="$style.hero">
      <div :class="$style.preview">
        <img alt="pengu_demo_theme" loading="lazy" width="566" height="373" decoding="async" data-nimg="1"
          src="/preview.svg" />
      </div>
      <div :class="$style.intro">
        <!-- <div class="...">a prefix line</div> -->
        <h2 :class="$style.title">Pengu Loader</h2>
        <p>
          A small JavaScript plugin loader, unleashes the power of customization from your League Client ✨
        </p>
        <div class="">
          <a href="https://github.com/PenguLoader/PenguLoader/releases" type="primary" target="_blank"
            class="button rounded-lg no-underline px-4 py-3 bg-slate-900 hover:bg-slate-700 dark:text-blue-300"
            rel="noopener noreferrer">
            Download</a>
          <a href="https://chat.pengu.lol" type="secondary" target="_blank" rel="noopener noreferrer"
            class="p-button">Join Discord</a>
        </div>
      </div>
    </div>
    <div class="p-tech-card">
      <div class="p-tech">
        <div class="p-tech-icon">
          <img alt="icon" loading="lazy" decoding="async" data-nimg="1" style="color:transparent"
            src="/features/javascript.png" />
        </div>
        <div class="p-tech-content">
          <h6 class="p-tech-title text-4xl italic">JavaScript-Powered</h6>
          <p class="p-tech-body">Build a more intelligent Client with JavaScript. It's great to be able to use your
            favorite front-end technologies.</p>
          <a href="/guide/welcome" type="link">
            Create your first plugin<svg xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-arrow-right" width="24" height="24" viewBox="0 0 24 24"
              stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 12l14 0"></path>
              <path d="M13 18l6 -6"></path>
              <path d="M13 6l6 6"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="p-tech">
        <div class="p-tech-icon">
          <img alt="icon" loading="lazy" width="74" height="74" decoding="async" data-nimg="1" style="color:transparent"
            src="/features/league-of-legends.png">
        </div>
        <div class="p-tech-content">
          <h6 class="p-tech-title">Personalized Look & Feel</h6>
          <p class="p-tech-body">Customize the Client interface to your preferences and make it unique.</p>
          <a href="https://chat.pengu.lol" type="link" class="sc-bcXHqe bOA-DgU">
            Get community plugins & themes
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-up-right" width="24"
              height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M17 7l-10 10"></path>
              <path d="M8 7l9 0l0 9"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<style module>
.hero {
  display: inline-flex;
  width: 100%;
  gap: 51px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 53px;
  margin-bottom: 58px;

  margin-bottom: 100px;
  margin-top: 82px;
  flex-direction: row;
}

.preview {
  max-width: 566px;
  width: 100%;
}

.preview img {
  max-width: 100%;
  height: auto;
  color: transparent;
  border-style: none;
}

.intro {
  max-width: 606px;
}

.intro h2 {
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin-bottom: 32px;
  line-height: 1;
}

.intro p {
  color: rgb(203, 213, 224);
  margin-bottom: 32px;
  font-size: 20px;
}

.title {
  border-top: none !important;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-top: 0 !important;
  padding-bottom: 2rem;
}
</style>