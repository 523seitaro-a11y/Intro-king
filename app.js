const gameModes = [
  { id: "easy", label: "初級", questions: 10, description: "人気上位30%から10問", rangeRatio: 0.3 },
  { id: "normal", label: "中級", questions: 10, description: "人気上位60%から10問", rangeRatio: 0.6 },
  { id: "hard", label: "上級", questions: 10, description: "全曲から10問", rangeRatio: 1 },
  { id: "all", label: "全問チャレンジ", questions: 999, description: "全曲" },
];

const defaultTopics = [];

const supabaseConfig = {
  url: "https://xblylmubtrpynwgcizwl.supabase.co",
  publishableKey: "sb_publishable_Hj6uRxvf4clbR8Lbh_6mdw_YnTd2lBN",
};

const supabaseRestUrl = `${supabaseConfig.url}/rest/v1`;
const supabaseTables = {
  topics: "intro_topics",
  rankings: "intro_rankings",
};

const topicGenreOptions = [
  "アニソン",
  "J-POP",
  "ボカロ",
  "K-POP",
  "ロック",
  "アイドル",
  "ゲーム音楽",
  "平成ヒット",
  "映画・ドラマ",
  "その他",
];

const maxTopicTracks = 500;
const defaultTopicImage = "assets/default-topic.png";

const state = {
  player: localStorage.getItem("introKingPlayer") || localStorage.getItem("introBeatPlayer") || "",
  profileIcon: localStorage.getItem("introKingProfileIcon") || "",
  profileImage: localStorage.getItem("introKingProfileImage") || "",
  topics: [],
  selectedTopic: null,
  currentTopic: null,
  currentMode: gameModes[1],
  rankingModeId: gameModes[1].id,
  currentTopicList: {
    title: "人気のお題",
    eyebrow: "Popular topics",
    description: "いいねが多い投稿お題",
    topics: [],
  },
  profilePageUser: "",
  editingTopicId: "",
  draftTracks: [],
  detailTopicId: "",
  detailReturnRoute: "mode",
  lastEntry: null,
  tracks: [],
  questionIndex: 0,
  correctCount: 0,
  correctTrack: null,
  startedAt: 0,
  timerId: null,
  answered: false,
  totalTime: 0,
  musicSearchSource: [],
  audio: new Audio(),
  sound: new Audio(),
  countdownTimerId: null,
  supabaseAvailable: true,
  supabaseSyncTimerId: null,
};

const views = {
  home: document.querySelector("#homeView"),
  genre: document.querySelector("#genreView"),
  mode: document.querySelector("#modeView"),
  topicDetail: document.querySelector("#topicDetailView"),
  create: document.querySelector("#createView"),
  game: document.querySelector("#gameView"),
  result: document.querySelector("#resultView"),
  ranking: document.querySelector("#rankingView"),
  myData: document.querySelector("#myDataView"),
  profileSettings: document.querySelector("#profileSettingsView"),
};

const elements = {
  popularGrid: document.querySelector("#popularGrid"),
  standardGrid: document.querySelector("#standardGrid"),
  popularListButton: document.querySelector("#popularListButton"),
  sidebarPopularList: document.querySelector("#sidebarPopularList"),
  topicListSidebarPopularList: document.querySelector("#topicListSidebarPopularList"),
  genreListButton: document.querySelector("#genreListButton"),
  genreGrid: document.querySelector("#genreGrid"),
  topicListGenreGrid: document.querySelector("#topicListGenreGrid"),
  topicListEyebrow: document.querySelector("#topicListEyebrow"),
  topicListDescription: document.querySelector("#topicListDescription"),
  genreTopicsTitle: document.querySelector("#genreTopicsTitle"),
  genreTopicsList: document.querySelector("#genreTopicsList"),
  topicSortTabs: document.querySelector("#topicSortTabs"),
  modeTopicImage: document.querySelector("#modeTopicImage"),
  modeTopicTitle: document.querySelector("#modeTopicTitle"),
  modeTopicDescription: document.querySelector("#modeTopicDescription"),
  modeTopicSummary: document.querySelector("#modeTopicSummary"),
  modeCreatorMeta: document.querySelector("#modeCreatorMeta"),
  modeLikeButton: document.querySelector("#modeLikeButton"),
  modeGrid: document.querySelector("#modeGrid"),
  modeRankingButton: document.querySelector("#modeRankingButton"),
  modeDetailButton: document.querySelector("#modeDetailButton"),
  modeHomeButton: document.querySelector("#modeHomeButton"),
  detailTopicImage: document.querySelector("#detailTopicImage"),
  detailTitle: document.querySelector("#detailTitle"),
  detailMeta: document.querySelector("#detailMeta"),
  detailDescription: document.querySelector("#detailDescription"),
  publishTopicButton: document.querySelector("#publishTopicButton"),
  detailEditButton: document.querySelector("#detailEditButton"),
  detailTrackList: document.querySelector("#detailTrackList"),
  createTopicButton: document.querySelector("#createTopicButton"),
  createTitle: document.querySelector("#createTitle"),
  topicForm: document.querySelector("#topicForm"),
  topicNameInput: document.querySelector("#topicNameInput"),
  topicGenreInput: document.querySelector("#topicGenreInput"),
  topicImageInput: document.querySelector("#topicImageInput"),
  topicImagePickerButton: document.querySelector("#topicImagePickerButton"),
  topicImagePreview: document.querySelector("#topicImagePreview"),
  topicImageDialog: document.querySelector("#topicImageDialog"),
  topicImageCloseButton: document.querySelector("#topicImageCloseButton"),
  topicImageChoices: document.querySelector("#topicImageChoices"),
  topicDescriptionInput: document.querySelector("#topicDescriptionInput"),
  unpublishTopicButton: document.querySelector("#unpublishTopicButton"),
  deleteTopicButton: document.querySelector("#deleteTopicButton"),
  deleteTopicDialog: document.querySelector("#deleteTopicDialog"),
  deleteTopicNoButton: document.querySelector("#deleteTopicNoButton"),
  deleteTopicYesButton: document.querySelector("#deleteTopicYesButton"),
  cancelEditButton: document.querySelector("#cancelEditButton"),
  musicSearchForm: document.querySelector("#musicSearchForm"),
  musicSearchInput: document.querySelector("#musicSearchInput"),
  musicSearchResults: document.querySelector("#musicSearchResults"),
  selectedTrackCount: document.querySelector("#selectedTrackCount"),
  selectedTrackList: document.querySelector("#selectedTrackList"),
  newGrid: document.querySelector("#newGrid"),
  newListButton: document.querySelector("#newListButton"),
  topSearchForm: document.querySelector("#topSearchForm"),
  topSearchInput: document.querySelector("#topSearchInput"),
  loginButton: document.querySelector("#loginButton"),
  loginDialog: document.querySelector("#loginDialog"),
  loginForm: document.querySelector("#loginForm"),
  loginNameInput: document.querySelector("#loginNameInput"),
  loginCancelButton: document.querySelector("#loginCancelButton"),
  myDataButton: document.querySelector("#myDataButton"),
  profileForm: document.querySelector("#profileForm"),
  profileImageInput: document.querySelector("#profileImageInput"),
  profileIconInput: document.querySelector("#profileIconInput"),
  profileNameInput: document.querySelector("#profileNameInput"),
  gameTopic: document.querySelector("#gameTopic"),
  questionProgress: document.querySelector("#questionProgress"),
  timerValue: document.querySelector("#timerValue"),
  artwork: document.querySelector("#artwork"),
  resultTitle: document.querySelector("#resultTitle"),
  resultMeta: document.querySelector("#resultMeta"),
  playButton: document.querySelector("#playButton"),
  nextButton: document.querySelector("#nextButton"),
  backHomeButton: document.querySelector("#backHomeButton"),
  resultTopic: document.querySelector("#resultTopic"),
  finalTime: document.querySelector("#finalTime"),
  resultRankText: document.querySelector("#resultRankText"),
  resultLikeButton: document.querySelector("#resultLikeButton"),
  viewRankingButton: document.querySelector("#viewRankingButton"),
  postResultButton: document.querySelector("#postResultButton"),
  retryButton: document.querySelector("#retryButton"),
  resultHomeButton: document.querySelector("#resultHomeButton"),
  rankingTitle: document.querySelector("#rankingTitle"),
  rankingDescription: document.querySelector("#rankingDescription"),
  rankingModeTabs: document.querySelector("#rankingModeTabs"),
  myDataPlayer: document.querySelector("#myDataPlayer"),
  myPageTitle: document.querySelector("#myPageTitle"),
  mypageAvatar: document.querySelector("#mypageAvatar"),
  mypageName: document.querySelector("#mypageName"),
  mypageInfo: document.querySelector("#mypageInfo"),
  mypageSidePlays: document.querySelector("#mypageSidePlays"),
  mypageSideBest: document.querySelector("#mypageSideBest"),
  mypageSideTop: document.querySelector("#mypageSideTop"),
  mypageSideTopics: document.querySelector("#mypageSideTopics"),
  profileSettingsButton: document.querySelector("#profileSettingsButton"),
  profileSettingsBackButton: document.querySelector("#profileSettingsBackButton"),
  settingsAvatar: document.querySelector("#settingsAvatar"),
  myTotalPlays: document.querySelector("#myTotalPlays"),
  myBestTime: document.querySelector("#myBestTime"),
  myTopCount: document.querySelector("#myTopCount"),
  myDataList: document.querySelector("#myDataList"),
  myTopicList: document.querySelector("#myTopicList"),
  choices: document.querySelector("#choices"),
  rankingList: document.querySelector("#rankingList"),
  toast: document.querySelector("#toast"),
};

async function loadTopics() {
  const localTopics = loadLocalTopics();
  const sharedTopics = await fetchSharedTopics();
  const topics = sharedTopics.length ? mergeTopics(localTopics, sharedTopics) : localTopics;
  state.topics = topics.length ? topics : defaultTopics;
  saveTopics({ sync: false });
}

function loadLocalTopics() {
  try {
    const saved = JSON.parse(localStorage.getItem("introKingTopics") || "[]");
    if (saved.length) {
      const normalizedSaved = saved.filter((topic) => !isDefaultTopic(topic));
      const savedIds = new Set(normalizedSaved.map((topic) => topic.id));
      return [...normalizedSaved, ...defaultTopics.filter((topic) => !savedIds.has(topic.id))];
    }
  } catch {
    return defaultTopics;
  }
  return defaultTopics;
}

function isDefaultTopic(topic) {
  return String(topic?.id || "").startsWith("sample-") || ["イントロキング", "イントロポスト"].includes(topic?.creator);
}

function saveTopics(options = {}) {
  localStorage.setItem("introKingTopics", JSON.stringify(state.topics));
  if (options.sync === false) return;
  scheduleTopicSync();
}

function mergeTopics(localTopics, sharedTopics) {
  const topicsById = new Map();
  [...localTopics, ...sharedTopics].forEach((topic) => {
    if (!topic?.id || isDefaultTopic(topic)) return;
    const current = topicsById.get(topic.id);
    if (!current || new Date(topic.updatedAt || 0) >= new Date(current.updatedAt || 0)) {
      topicsById.set(topic.id, normalizeTopic(topic));
    }
  });
  return [...topicsById.values()];
}

function normalizeTopic(topic) {
  return {
    ...topic,
    likedBy: Array.isArray(topic.likedBy) ? topic.likedBy : [],
    tracks: Array.isArray(topic.tracks) ? topic.tracks : [],
    likes: Number(topic.likes || 0),
    baseLikes: Number(topic.baseLikes || 0),
    views: Number(topic.views || 0),
    playCount: Number(topic.playCount || 0),
    published: Boolean(topic.published),
  };
}

function supabaseHeaders(extra = {}) {
  return {
    apikey: supabaseConfig.publishableKey,
    Authorization: `Bearer ${supabaseConfig.publishableKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function supabaseRequest(path, options = {}) {
  if (!state.supabaseAvailable) return null;
  try {
    const response = await fetch(`${supabaseRestUrl}${path}`, {
      ...options,
      headers: supabaseHeaders(options.headers || {}),
    });
    if (!response.ok) throw new Error(`Supabase ${response.status}`);
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.warn("Supabase sync skipped:", error);
    state.supabaseAvailable = false;
    return null;
  }
}

async function fetchSharedTopics() {
  const rows = await supabaseRequest(`/${supabaseTables.topics}?select=data`);
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => row.data).filter(Boolean);
}

function scheduleTopicSync() {
  window.clearTimeout(state.supabaseSyncTimerId);
  state.supabaseSyncTimerId = window.setTimeout(syncTopicsToSupabase, 500);
}

async function syncTopicsToSupabase() {
  if (!state.supabaseAvailable) return;
  const rows = state.topics.filter((topic) => !isDefaultTopic(topic)).map((topic) => ({
    id: topic.id,
    data: normalizeTopic(topic),
    updated_at: new Date().toISOString(),
  }));
  if (!rows.length) return;
  await supabaseRequest(`/${supabaseTables.topics}?on_conflict=id`, {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
}

async function deleteSharedTopic(topicId) {
  await supabaseRequest(`/${supabaseTables.topics}?id=eq.${encodeURIComponent(topicId)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal",
    },
  });
}

async function loadSharedRankings() {
  const rows = await supabaseRequest(`/${supabaseTables.rankings}?select=key,data`);
  if (!Array.isArray(rows)) return;
  rows.forEach((row) => {
    if (!row.key || !Array.isArray(row.data)) return;
    localStorage.setItem(row.key, JSON.stringify(row.data));
  });
}

async function saveSharedRanking(key, rankings) {
  await supabaseRequest(`/${supabaseTables.rankings}?on_conflict=key`, {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      key,
      data: rankings,
      updated_at: new Date().toISOString(),
    }),
  });
}

function renderHome() {
  const standard = getStandardTopics().slice(0, 20);
  const popular = getPopularTopics().slice(0, 16);
  const newest = getNewTopics().slice(0, 16);
  elements.standardGrid.innerHTML = standard.length ? standard.map(topicCard).join("") : emptyCard("定番お題がありません");
  elements.popularGrid.innerHTML = popular.length ? popular.map(topicCard).join("") : emptyCard("お題を作成してください");
  elements.newGrid.innerHTML = newest.length ? newest.map(topicCard).join("") : emptyCard("まだ新着お題がありません");
  renderSharedSidebars();
}

function renderSharedSidebars() {
  const popular = getPopularTopics();
  const popularMarkup = popular.length
    ? popular.slice(0, 6).map((topic) => `<button data-topic-id="${escapeHtml(topic.id)}">${escapeHtml(topic.name)}</button>`).join("")
    : `<span>お題なし</span>`;
  const genreMarkup = getGenres()
    .map((genre) => `<button class="genre-button" data-genre="${escapeHtml(genre)}">${escapeHtml(genre)}</button>`)
    .join("");
  [elements.sidebarPopularList, elements.topicListSidebarPopularList].filter(Boolean).forEach((target) => {
    target.innerHTML = popularMarkup;
  });
  [elements.genreGrid, elements.topicListGenreGrid].filter(Boolean).forEach((target) => {
    target.innerHTML = genreMarkup;
  });
}

function topicCard(topic) {
  const liked = isTopicLiked(topic);
  return `
    <article class="topic-card topic-card-action">
      <button class="topic-image-button" data-topic-id="${escapeHtml(topic.id)}" type="button" aria-label="${escapeHtml(topic.name)}を開く">
        ${topicImageHtml(topic)}
      </button>
      <button class="topic-title-button" data-topic-id="${escapeHtml(topic.id)}" type="button">${escapeHtml(topic.name)}</button>
      <span>${escapeHtml(topic.genre || "未分類")} / ${topic.tracks.length}曲</span>
      <div class="topic-meta">
        <span class="topic-stat">▶ ${formatCount(topic.playCount || 0)}</span>
        <span class="topic-stat topic-like-count ${liked ? "liked" : ""}">♥ ${formatCount(topic.likes || 0)}</span>
      </div>
    </article>
  `;
}

function topicListItem(topic, index) {
  const liked = isTopicLiked(topic);
  return `
    <li>
      <div class="topic-list-button topic-row no-rank" data-topic-id="${escapeHtml(topic.id)}">
        ${topicImageHtml(topic, "topic-thumb")}
        <strong>${escapeHtml(topic.name)}</strong>
        <small>${escapeHtml(topic.genre || "未分類")} / ${topic.tracks.length}曲 / ♥ ${topic.likes || 0}</small>
        ${creatorButton(topic)}
        <button class="like-button ${liked ? "liked" : ""}" data-like-topic="${escapeHtml(topic.id)}" type="button" aria-label="いいね">♥ ${topic.likes || 0}</button>
      </div>
    </li>
  `;
}

function emptyCard(text) {
  return `<div class="empty-state">${escapeHtml(text)}</div>`;
}

function isTopicLiked(topic) {
  return Boolean(topic?.likedBy?.includes(state.player || "guest"));
}

function getTopicImage(topic) {
  return topic?.image || (topic?.tracks?.[0]?.artworkUrl100 ? largerArtwork(topic.tracks[0].artworkUrl100) : "");
}

function topicImageHtml(topic, className = "") {
  const image = getTopicImage(topic);
  if (image) return `<img class="${className}" src="${escapeHtml(image)}" alt="" />`;
  return `<span class="topic-image-placeholder ${className}"></span>`;
}

function formatCount(value) {
  const count = Number(value) || 0;
  if (count >= 10000) return `${(count / 10000).toFixed(1).replace(".0", "")}万`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(".0", "")}千`;
  return String(count);
}

function creatorButton(topic, withName = false) {
  const creator = topic.creator || "guest";
  return `
    <button class="creator-button" data-user-name="${escapeHtml(creator)}" type="button" aria-label="${escapeHtml(creator)}のページ">
      ${creatorAvatarHtml(topic)}
      ${withName ? `<span>${escapeHtml(creator)}</span>` : ""}
    </button>
  `;
}

function creatorAvatarHtml(topic) {
  const creator = topic.creator || "guest";
  const image = getCreatorImage(topic);
  const icon = getCreatorIcon(topic);
  return image
    ? `<span class="creator-avatar"><img src="${escapeHtml(image)}" alt="" /></span>`
    : `<span class="creator-avatar">${escapeHtml(icon || creator.slice(0, 1).toUpperCase())}</span>`;
}

function getCreatorIcon(topic) {
  if (topic.creator === state.player) return state.profileIcon;
  if (topic.creator === "イントロポスト") return "王";
  return topic.creatorIcon || topic.creator?.slice(0, 1).toUpperCase() || "人";
}

function getCreatorImage(topic) {
  if (topic.creator === state.player) return state.profileImage;
  return topic.creatorImage || "";
}

function bindEvents() {
  document.body.addEventListener("click", (event) => {
    const likeButton = event.target.closest("[data-like-topic]");
    if (likeButton) {
      event.stopPropagation();
      likeTopic(likeButton.dataset.likeTopic);
      return;
    }

    const userButton = event.target.closest("[data-user-name]");
    if (userButton) {
      event.stopPropagation();
      openUserPage(userButton.dataset.userName);
      return;
    }

    const listButton = event.target.closest("[data-topic-list]");
    if (listButton) {
      renderTopicListPage({
        title: listButton.dataset.topicList === "genres" ? "ジャンル" : "人気のお題",
        eyebrow: listButton.dataset.topicList === "genres" ? "Genres" : "Popular topics",
        description: listButton.dataset.topicList === "genres" ? "ジャンルごとの人気お題" : "いいねが多い投稿お題",
        topics: getPopularTopics(),
      });
      return;
    }

    const homeListButton = event.target.closest("[data-home-list]");
    if (homeListButton) {
      const lists = {
        standard: {
          title: "定番",
          eyebrow: "Standard",
          description: "イントロポスト定番お題",
          topics: getStandardTopics(),
        },
        popular: {
          title: "急上昇",
          eyebrow: "Trending",
          description: "いいねが多い順",
          topics: getPopularTopics(),
        },
        new: {
          title: "新着",
          eyebrow: "New topics",
          description: "追加された順",
          topics: getNewTopics(),
        },
      };
      renderTopicListPage(lists[homeListButton.dataset.homeList]);
      return;
    }

    const imageButton = event.target.closest("[data-topic-image]");
    if (imageButton) {
      event.preventDefault();
      setTopicImage(imageButton.dataset.topicImage);
      return;
    }

    const editButton = event.target.closest("[data-edit-topic]");
    if (editButton) {
      event.stopPropagation();
      openCreateView(editButton.dataset.editTopic);
      return;
    }

    const removeTrackButton = event.target.closest("[data-remove-track]");
    if (removeTrackButton) {
      removeDraftTrack(Number(removeTrackButton.dataset.removeTrack));
      return;
    }

    const addTrackButton = event.target.closest("[data-add-track]");
    if (addTrackButton) {
      addTrackFromSearch(Number(addTrackButton.dataset.addTrack));
      return;
    }

    const previewButton = event.target.closest("[data-preview-track]");
    if (previewButton) {
      event.stopPropagation();
      playPreviewTrack(previewButton.dataset.previewTrack);
      return;
    }

    const topicSortButton = event.target.closest("[data-topic-sort]");
    if (topicSortButton) {
      state.currentTopicList.sort = topicSortButton.dataset.topicSort;
      renderGenrePage();
      return;
    }

    const topicRow = event.target.closest("[data-topic-id]");
    if (topicRow) {
      openModeSelect(topicRow.dataset.topicId);
      return;
    }

    const genreButton = event.target.closest("[data-genre]");
    if (genreButton) {
      renderTopicListPage({
        title: `${genreButton.dataset.genre}のお題`,
        eyebrow: "Genre",
        description: "ジャンル内の人気順",
        topics: getPublishedTopics().filter((topic) => topic.genre === genreButton.dataset.genre),
      });
    }
  });

  elements.topSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderSearchResults(elements.topSearchInput.value.trim());
  });

  elements.createTopicButton.addEventListener("click", () => openCreateView());
  elements.loginButton.addEventListener("click", openLoginDialog);
  elements.loginCancelButton.addEventListener("click", () => elements.loginDialog.close());
  elements.loginForm.addEventListener("submit", loginPlayer);
  elements.myDataButton.addEventListener("click", () => {
    if (!state.player) {
      openLoginDialog();
      return;
    }
    state.profilePageUser = "";
    route("myData");
  });
  elements.modeRankingButton.addEventListener("click", () => route("ranking"));
  elements.modeDetailButton.addEventListener("click", () => openTopicDetail(state.selectedTopic?.id, "mode", false));
  elements.modeHomeButton.addEventListener("click", () => route("home"));
  elements.modeLikeButton.addEventListener("click", () => likeTopic(state.selectedTopic?.id));
  elements.profileSettingsButton.addEventListener("click", () => route("profileSettings"));
  elements.profileSettingsBackButton.addEventListener("click", () => route("myData"));
  elements.publishTopicButton.addEventListener("click", publishCurrentTopic);
  elements.detailEditButton.addEventListener("click", () => openCreateView(state.detailTopicId));
  elements.backHomeButton.addEventListener("click", () => route("home"));
  elements.viewRankingButton.addEventListener("click", () => route("ranking"));
  elements.resultLikeButton.addEventListener("click", () => likeTopic(state.lastEntry?.topicId));
  elements.postResultButton.addEventListener("click", postResult);
  elements.retryButton.addEventListener("click", retryLastTopic);
  elements.resultHomeButton.addEventListener("click", () => route("home"));
  elements.topicForm.addEventListener("submit", saveTopicFromForm);
  elements.unpublishTopicButton.addEventListener("click", unpublishEditingTopic);
  elements.deleteTopicButton.addEventListener("click", () => elements.deleteTopicDialog.showModal());
  elements.deleteTopicNoButton.addEventListener("click", () => elements.deleteTopicDialog.close());
  elements.deleteTopicYesButton.addEventListener("click", deleteEditingTopic);
  elements.topicImagePickerButton.addEventListener("click", () => {
    renderTopicImageChoices();
    elements.topicImageDialog.showModal();
  });
  elements.topicImageCloseButton.addEventListener("click", () => elements.topicImageDialog.close());
  elements.cancelEditButton.addEventListener("click", () => route("home"));
  elements.musicSearchForm.addEventListener("submit", searchMusicForTopic);
  elements.musicSearchInput.addEventListener("input", renderMusicSuggestions);

  elements.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveProfile();
  });

  elements.playButton.addEventListener("click", playCurrentTrack);
  elements.nextButton.addEventListener("click", nextQuestion);
  window.addEventListener("hashchange", syncRoute);
}

function getPopularTopics() {
  return sortTopics(getPublishedTopics(), "popular");
}

function getStandardTopics() {
  return sortTopics(getPublishedTopics().filter((topic) => topic.creator === "イントロポスト"), "popular");
}

function getNewTopics() {
  return sortTopics(getPublishedTopics(), "new");
}

function getGenres() {
  return [...new Set(getPublishedTopics().map((topic) => topic.genre || "未分類"))];
}

function getPublishedTopics() {
  return state.topics.filter((topic) => topic.published || topic.creator === "イントロポスト");
}

function sortTopics(topics, type) {
  return [...topics].sort((a, b) => {
    if (type === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    return (b.likes || 0) - (a.likes || 0) || new Date(b.createdAt) - new Date(a.createdAt);
  });
}

function renderTopicListPage(list) {
  state.currentTopicList = {
    ...list,
    baseTopics: list.baseTopics || list.topics || [],
    sort: list.sort || "popular",
  };
  route("genre");
}

function renderSearchResults(text) {
  const query = text.toLowerCase();
  const topics = query
    ? getPublishedTopics().filter((topic) => topic.name.toLowerCase().includes(query))
    : getPopularTopics();
  renderTopicListPage({
    title: text ? `「${text}」の検索結果` : "人気のお題",
    eyebrow: "Topic search",
    description: "追加済みのお題名から検索",
    topics: sortTopics(topics, "popular"),
  });
}

function renderGenrePage() {
  renderSharedSidebars();
  const list = state.currentTopicList;
  const sort = list.sort || "popular";
  const topics = sortTopics(list.baseTopics || list.topics || [], sort);
  elements.topicListEyebrow.textContent = list.eyebrow;
  elements.genreTopicsTitle.textContent = list.title;
  elements.topicListDescription.textContent = sort === "new" ? "新着順" : "人気順";
  elements.topicSortTabs.innerHTML = ["popular", "new"]
    .map(
      (type) => `
        <button class="mode-tab ${type === sort ? "active" : ""}" data-topic-sort="${type}" type="button">
          ${type === "popular" ? "人気順" : "新着順"}
        </button>
      `,
    )
    .join("");
  elements.genreTopicsList.innerHTML = topics.length
    ? topics.map(topicListItem).join("")
    : `<li class="empty-state">該当するお題がありません</li>`;
}

function likeTopic(topicId) {
  const topic = getTopic(topicId);
  if (!topic) return;
  const playerKey = state.player || "guest";
  topic.likedBy = topic.likedBy || [];
  if (topic.likedBy.includes(playerKey)) {
    topic.likedBy = topic.likedBy.filter((name) => name !== playerKey);
  } else {
    topic.likedBy.push(playerKey);
  }
  topic.likes = (topic.baseLikes || 0) + topic.likedBy.length;
  saveTopics();
  renderHome();
  if (window.location.hash === "#genre") renderGenrePage();
  if (window.location.hash === "#mode") renderModeSelect();
  if (window.location.hash === "#result") renderResult();
}

function openUserPage(userName) {
  if (!userName) return;
  state.profilePageUser = userName;
  route("myData");
}

function openLoginDialog() {
  elements.loginNameInput.value = state.player;
  if (elements.loginDialog.open) return;
  elements.loginDialog.showModal();
  elements.loginNameInput.focus();
}

function loginPlayer(event) {
  event.preventDefault();
  state.player = elements.loginNameInput.value.trim();
  if (!state.player) return;
  localStorage.setItem("introKingPlayer", state.player);
  elements.loginDialog.close();
  renderPlayer();
  renderAuthState();
  showToast("ログインしました。");
}

function openCreateView(topicId = "") {
  const topic = topicId ? getTopic(topicId) : null;
  renderGenreSelect(topic?.genre);
  state.editingTopicId = topic?.id || "";
  state.draftTracks = topic ? [...topic.tracks] : [];
  elements.createTitle.textContent = topic ? "お題編集" : "お題作成";
  elements.topicNameInput.value = topic?.name || "";
  elements.topicImageInput.value = topic?.image || "";
  elements.topicDescriptionInput.value = topic?.description || "";
  elements.musicSearchInput.value = "";
  elements.musicSearchResults.innerHTML = "";
  elements.unpublishTopicButton.classList.toggle("hidden", !topic?.published);
  elements.deleteTopicButton.classList.toggle("hidden", !topic);
  elements.cancelEditButton.textContent = "ホームへ戻る";
  renderDraftTracks();
  renderTopicImageChoices();
  renderMusicSuggestions();
  route("create");
}

function renderGenreSelect(selectedGenre = "") {
  elements.topicGenreInput.innerHTML = topicGenreOptions
    .map((genre) => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`)
    .join("");
  elements.topicGenreInput.value = topicGenreOptions.includes(selectedGenre) ? selectedGenre : topicGenreOptions[0];
}

async function searchMusicForTopic(event) {
  event.preventDefault();
  const query = elements.musicSearchInput.value.trim();
  if (!query) {
    renderMusicSuggestions();
    return;
  }
  elements.musicSearchResults.innerHTML = `<div class="empty-state">検索中...</div>`;
  try {
    const tracks = await searchTracks(query);
    renderMusicResultList(filterTracksByQuery(tracks, query));
  } catch (error) {
    console.error(error);
    elements.musicSearchResults.innerHTML = `<div class="empty-state">曲の検索に失敗しました</div>`;
  }
}

async function renderMusicSuggestions() {
  if (elements.musicSearchInput.value.trim()) return;
  const query = `${elements.topicNameInput.value.trim()} ${elements.topicGenreInput.value || "J-POP"} 人気`.trim();
  elements.musicSearchResults.innerHTML = `<div class="empty-state">予測曲を読み込み中...</div>`;
  try {
    const tracks = await searchTracks(query);
    renderMusicResultList(tracks.slice(0, 12));
    if (!state.musicSearchCache.length) elements.musicSearchResults.innerHTML = `<div class="empty-state">予測曲が見つかりません</div>`;
  } catch (error) {
    console.error(error);
    elements.musicSearchResults.innerHTML = `<div class="empty-state">予測曲の取得に失敗しました</div>`;
  }
}

function renderMusicResultList(tracks = state.musicSearchSource) {
  state.musicSearchSource = tracks;
  const selectedIds = new Set(state.draftTracks.map((track) => track.trackId));
  state.musicSearchCache = tracks.filter((track) => !selectedIds.has(track.trackId));
  elements.musicSearchResults.innerHTML = state.musicSearchCache.length
    ? state.musicSearchCache.map(musicResultItem).join("")
    : `<div class="empty-state">追加できる曲がありません</div>`;
}

function filterTracksByQuery(tracks, query) {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
  if (!words.length) return tracks;
  const matched = tracks.filter((track) => {
    const haystack = `${track.trackName} ${track.artistName}`.toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
  return matched.length ? matched : tracks;
}

function musicResultItem(track, index) {
  return `
    <div class="music-row">
      <img src="${escapeHtml(largerArtwork(track.artworkUrl100))}" alt="" />
      <div>
        <strong>${escapeHtml(track.trackName)}</strong>
        <small>${escapeHtml(track.artistName)}</small>
      </div>
      <button class="ghost-button" data-preview-track="${escapeHtml(track.previewUrl)}" type="button">再生</button>
      <button class="ghost-button" data-add-track="${index}" type="button">追加</button>
    </div>
  `;
}

function addTrackFromSearch(index) {
  const track = state.musicSearchCache?.[index];
  if (!track) return;
  if (state.draftTracks.some((item) => item.trackId === track.trackId)) {
    showToast("この曲は追加済みです。");
    return;
  }
  if (state.draftTracks.length >= maxTopicTracks) {
    showToast(`お題に追加できる曲は最大${maxTopicTracks}曲です。`);
    return;
  }
  state.draftTracks.push(normalizeTrack(track));
  state.draftTracks = uniqueTracks(state.draftTracks);
  renderDraftTracks();
  renderMusicResultList();
}

function removeDraftTrack(trackId) {
  state.draftTracks = state.draftTracks.filter((track) => track.trackId !== trackId);
  renderDraftTracks();
  renderMusicResultList();
}

function renderDraftTracks() {
  elements.selectedTrackCount.textContent = `${state.draftTracks.length} / ${maxTopicTracks}曲`;
  elements.selectedTrackList.innerHTML = state.draftTracks.length
    ? state.draftTracks.map(selectedTrackItem).join("")
    : `<li class="empty-state">曲を検索して追加してください</li>`;
  renderTopicImageChoices();
}

function renderTopicImageChoices() {
  const groups = getTopicImageOptionGroups();
  const selected = elements.topicImageInput.value || (state.draftTracks[0]?.artworkUrl100 ? largerArtwork(state.draftTracks[0].artworkUrl100) : defaultTopicImage);
  elements.topicImagePreview.src = selected;
  elements.topicImageChoices.innerHTML = groups
    .map((group) => `
      <div class="topic-image-group">
        <strong>${escapeHtml(group.title)}</strong>
        <div class="topic-image-list">
          ${group.options.length ? group.options.map((option) => topicImageOption(option, selected)).join("") : `<span class="empty-image-option">追加した曲がありません</span>`}
        </div>
      </div>
    `)
    .join("");
}

function topicImageOption(option, selected) {
  return `
    <button class="${option.value === selected ? "active" : ""}" data-topic-image="${escapeHtml(option.value)}" type="button">
      <img src="${escapeHtml(option.value)}" alt="" />
      <span>${escapeHtml(option.label)}</span>
    </button>
  `;
}

function getTopicImageOptionGroups() {
  const albumOptions = uniqueTracks(state.draftTracks)
    .slice(0, 12)
    .map((track, index) => ({
      label: `${index + 1}. ${track.trackName}`,
      value: largerArtwork(track.artworkUrl100),
    }));
  return [
    { title: "運営画像", options: [{ label: "デフォルト", value: defaultTopicImage }] },
    { title: "追加した曲のアルバム画像", options: albumOptions },
  ];
}

function setTopicImage(value) {
  elements.topicImageInput.value = value;
  renderTopicImageChoices();
  elements.topicImageDialog.close();
}

function selectedTrackItem(track) {
  return `
    <li class="music-row">
      <img src="${escapeHtml(largerArtwork(track.artworkUrl100))}" alt="" />
      <div>
        <strong>${escapeHtml(track.trackName)}</strong>
        <small>${escapeHtml(track.artistName)}</small>
      </div>
      <button class="ghost-button" data-preview-track="${escapeHtml(track.previewUrl)}" type="button">再生</button>
      <button class="ghost-button danger" data-remove-track="${track.trackId}" type="button">削除</button>
    </li>
  `;
}

function detailTrackItem(track, index) {
  return `
    <li class="music-row">
      <img src="${escapeHtml(largerArtwork(track.artworkUrl100))}" alt="" />
      <div>
        <strong>${index + 1}. ${escapeHtml(track.trackName)}</strong>
        <small>${escapeHtml(track.artistName)}</small>
      </div>
      <button class="ghost-button" data-preview-track="${escapeHtml(track.previewUrl)}" type="button">再生</button>
    </li>
  `;
}

async function saveTopicFromForm(event) {
  event.preventDefault();
  if (!state.player) {
    showToast("お題作成にはログインが必要です。");
    route("myData");
    return;
  }
  if (state.draftTracks.length < 5) {
    showToast("初級で遊べるよう、最低5曲追加してください。");
    return;
  }
  if (state.draftTracks.length > maxTopicTracks) {
    showToast(`お題に保存できる曲は最大${maxTopicTracks}曲です。`);
    return;
  }
  if (!state.editingTopicId) {
    state.draftTracks = uniqueTracks(state.draftTracks);
  }

  const existing = state.editingTopicId ? getTopic(state.editingTopicId) : null;
  const likedBy = existing?.likedBy || [];
  const topicImage = getSelectedTopicImage(existing);
  const topic = {
    id: existing?.id || `topic-${Date.now()}`,
    name: elements.topicNameInput.value.trim(),
    genre: elements.topicGenreInput.value.trim() || "未分類",
    image: topicImage,
    description: elements.topicDescriptionInput.value.trim(),
    creator: existing?.creator || state.player,
    creatorIcon: existing?.creator === state.player || !existing ? state.profileIcon : existing?.creatorIcon || "",
    creatorImage: existing?.creator === state.player || !existing ? state.profileImage : existing?.creatorImage || "",
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    baseLikes: existing?.baseLikes || 0,
    likes: (existing?.baseLikes || 0) + likedBy.length,
    views: existing?.views || 0,
    playCount: existing?.playCount || 0,
    likedBy,
    published: existing?.published || false,
    tracks: state.draftTracks,
  };

  if (existing) {
    state.topics = state.topics.map((item) => (item.id === topic.id ? topic : item));
  } else {
    state.topics.unshift(topic);
  }
  saveTopics();
  renderHome();
  openTopicDetail(topic.id, "create", true);
}

function getSelectedTopicImage(existing) {
  if (elements.topicImageInput.value) return elements.topicImageInput.value;
  if (state.draftTracks[0]?.artworkUrl100) return largerArtwork(state.draftTracks[0].artworkUrl100);
  return existing?.image || "";
}

function normalizeTrack(track) {
  return {
    trackId: track.trackId,
    trackName: track.trackName,
    artistName: track.artistName,
    previewUrl: track.previewUrl,
    artworkUrl100: track.artworkUrl100,
    trackViewUrl: track.trackViewUrl,
  };
}

function uniqueTracks(tracks) {
  const seen = new Set();
  return tracks.filter((track) => {
    if (seen.has(track.trackId)) return false;
    seen.add(track.trackId);
    return true;
  });
}

function openTopicDetail(topicId, returnRoute = "mode", showPublish = false) {
  const topic = getTopic(topicId);
  if (!topic) return;
  topic.views = (topic.views || 0) + 1;
  saveTopics();
  state.detailTopicId = topic.id;
  state.detailReturnRoute = returnRoute;
  state.currentTopic = topic;
  state.selectedTopic = topic;
  state.showPublishAction = showPublish;
  renderTopicDetail();
  route("topicDetail");
}

function renderTopicDetail() {
  const topic = getTopic(state.detailTopicId);
  if (!topic) return;
  elements.detailTopicImage.innerHTML = topicImageHtml(topic);
  elements.detailTitle.textContent = topic.name;
  elements.detailMeta.textContent = `${topic.genre || "未分類"} / ${topic.tracks.length}曲 / ビュー ${formatCount(topic.views || 0)} / ♥ ${formatCount(topic.likes || 0)}`;
  elements.detailDescription.textContent = topic.description || "説明はありません。";
  elements.publishTopicButton.classList.toggle("hidden", topic.published && !state.showPublishAction);
  elements.publishTopicButton.textContent = topic.published ? "更新" : "投稿する";
  elements.detailTrackList.innerHTML = topic.tracks.length
    ? topic.tracks.map(detailTrackItem).join("")
    : `<li class="empty-state">曲がありません</li>`;
}

function publishCurrentTopic() {
  const topic = getTopic(state.detailTopicId);
  if (!topic) return;
  const wasPublished = topic.published;
  topic.published = true;
  topic.updatedAt = new Date().toISOString();
  saveTopics();
  renderHome();
  route("myData");
  showToast(wasPublished ? "お題を更新しました。" : "お題を投稿しました。");
}

function unpublishEditingTopic() {
  const topic = getTopic(state.editingTopicId);
  if (!topic) return;
  topic.published = false;
  topic.updatedAt = new Date().toISOString();
  saveTopics();
  renderHome();
  elements.unpublishTopicButton.classList.add("hidden");
  showToast("お題を公開停止しました。");
}

function deleteEditingTopic() {
  const topic = getTopic(state.editingTopicId);
  if (!topic) return;
  state.topics = state.topics.filter((item) => item.id !== topic.id);
  saveTopics();
  deleteSharedTopic(topic.id);
  elements.deleteTopicDialog.close();
  renderHome();
  showToast("お題を削除しました。");
  route("myData");
}

function playPreviewTrack(previewUrl) {
  if (!previewUrl) return;
  if (state.audio.src === previewUrl && !state.audio.paused) {
    state.audio.pause();
    return;
  }
  state.audio.src = previewUrl;
  state.audio.currentTime = 0;
  state.audio.play();
}

function playAnswerSound(isCorrect) {
  state.sound.pause();
  state.sound.currentTime = 0;
  state.sound.src = isCorrect ? "assets/correct.mp3" : "assets/wrong.mp3";
  state.sound.play();
}

function openModeSelect(topicId) {
  const topic = getTopic(topicId);
  if (!topic) return;
  topic.views = (topic.views || 0) + 1;
  saveTopics();
  state.selectedTopic = topic;
  state.currentTopic = topic;
  state.currentMode = gameModes[1];
  state.rankingModeId = state.currentMode.id;
  renderModeSelect();
  route("mode");
}

function renderModeSelect() {
  if (!state.selectedTopic) return;
  elements.modeTopicImage.innerHTML = topicImageHtml(state.selectedTopic);
  elements.modeTopicTitle.textContent = state.selectedTopic.name;
  elements.modeTopicDescription.textContent = `${state.selectedTopic.genre || "未分類"} / ${state.selectedTopic.tracks.length}曲 / ビュー ${formatCount(state.selectedTopic.views || 0)} / ♥ ${formatCount(state.selectedTopic.likes || 0)}`;
  elements.modeTopicSummary.textContent = state.selectedTopic.description || "説明はありません。";
  elements.modeCreatorMeta.innerHTML = creatorButton(state.selectedTopic, true);
  elements.modeLikeButton.textContent = `♥ ${state.selectedTopic.likes || 0}`;
  elements.modeLikeButton.classList.toggle("liked", isTopicLiked(state.selectedTopic));
  elements.modeGrid.innerHTML = gameModes
    .map((mode) => {
      const playableCount = getModeQuestionCount(mode, state.selectedTopic);
      const availableCount = getAvailableTrackCount(state.selectedTopic);
      const disabled = mode.id !== "all" && availableCount < mode.questions ? "disabled" : "";
      return `
        <button class="mode-card" data-mode-id="${mode.id}" type="button" ${disabled}>
          <strong>${mode.label}</strong>
          <span>${mode.id === "all" ? `${playableCount}問` : mode.description}</span>
        </button>
      `;
    })
    .join("");

  elements.modeGrid.querySelectorAll("[data-mode-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = gameModes.find((item) => item.id === button.dataset.modeId) || gameModes[1];
      startGame(state.selectedTopic.id, mode);
    });
  });
}

async function startGame(topicId, mode = state.currentMode) {
  if (!state.player) {
    showToast("ランキング記録にはログインが必要です。まずプレイヤー名を登録してください。");
    route("myData");
    return;
  }

  const topic = getTopic(topicId);
  if (!topic) return;
  if (!topic.tracks.length && topic.seedQuery) {
    showToast("サンプルお題の曲を準備中です...");
    const tracks = await searchTracks(topic.seedQuery);
    topic.tracks = tracks.slice(0, 30).map(normalizeTrack);
    if (!topic.image && topic.tracks[0]?.artworkUrl100) topic.image = largerArtwork(topic.tracks[0].artworkUrl100);
    saveTopics();
  }

  const questionCount = getModeQuestionCount(mode, topic);
  if (questionCount < 5) {
    showToast("このお題は曲数が足りません。お題を編集して曲を追加してください。");
    return;
  }

  topic.playCount = (topic.playCount || 0) + 1;
  saveTopics();
  state.currentTopic = topic;
  state.currentMode = mode;
  state.rankingModeId = mode.id;
  state.tracks = selectTracksForMode(topic, mode, questionCount);
  state.questionIndex = 0;
  state.correctCount = 0;
  state.totalTime = 0;
  route("game");
  loadQuestion();
}

function getModeQuestionCount(mode, topic) {
  const availableCount = getAvailableTrackCount(topic);
  if (mode.id === "all") return topic.tracks.length;
  return Math.min(mode.questions, availableCount);
}

function selectTracksForMode(topic, mode, questionCount) {
  if (mode.id === "all") return shuffle(topic.tracks);
  const orderedTracks = [...topic.tracks];
  const preferredCount = Math.max(questionCount, Math.ceil(orderedTracks.length * (mode.rangeRatio || 1)));
  const preferredTracks = orderedTracks.slice(0, preferredCount);
  const fallbackTracks = orderedTracks.slice(preferredCount);
  const selected = shuffle(preferredTracks).slice(0, questionCount);
  if (selected.length >= questionCount) return selected;
  const selectedIds = new Set(selected.map((track) => track.trackId));
  const fallback = shuffle(fallbackTracks.filter((track) => !selectedIds.has(track.trackId))).slice(0, questionCount - selected.length);
  return [...selected, ...fallback];
}

function getAvailableTrackCount(topic) {
  if (topic.seedQuery && !topic.tracks.length) return 30;
  return topic.tracks.length;
}

function searchTracks(query) {
  const params = new URLSearchParams({
    term: query,
    country: "JP",
    media: "music",
    entity: "song",
    limit: "80",
    lang: "ja_jp",
  });

  return jsonp(`https://itunes.apple.com/search?${params.toString()}`).then((data) => {
    const seen = new Set();
    return data.results
      .filter((track) => track.previewUrl && track.trackName && track.artistName)
      .filter((track) => {
        const key = `${track.artistName}-${track.trackName}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(normalizeTrack);
  });
}

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `introKingCallback${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const script = document.createElement("script");
    const separator = url.includes("?") ? "&" : "?";
    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("iTunes API timeout"));
    }, 12000);

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("iTunes API request failed"));
    };

    script.src = `${url}${separator}callback=${callbackName}`;
    document.body.appendChild(script);

    function cleanup() {
      window.clearTimeout(timeoutId);
      delete window[callbackName];
      script.remove();
    }
  });
}

function loadQuestion() {
  stopAudio();
  window.clearInterval(state.countdownTimerId);
  state.answered = false;
  state.correctTrack = state.tracks[state.questionIndex];
  state.startedAt = 0;
  elements.timerValue.textContent = "0.00";
  elements.gameTopic.textContent = state.currentTopic.name;
  elements.questionProgress.textContent = `${state.questionIndex + 1} / ${state.tracks.length}`;
  elements.artwork.src = largerArtwork(state.correctTrack.artworkUrl100);
  elements.artwork.classList.add("hidden");
  elements.resultTitle.textContent = "この曲は？";
  elements.resultMeta.textContent = `${state.currentMode.label}モード。再生ボタンを押すとカウントダウンします。`;
  elements.playButton.disabled = false;
  elements.playButton.textContent = "再生";
  elements.nextButton.classList.add("hidden");
  renderChoices();
  elements.choices.classList.remove("countdown-preview");
}

function renderChoices() {
  const wrong = shuffle(state.currentTopic.tracks.filter((track) => track.trackId !== state.correctTrack.trackId)).slice(0, 3);
  const choices = shuffle([state.correctTrack, ...wrong]);
  elements.choices.innerHTML = choices
    .map(
      (track) => `
        <button class="choice-button" data-track-id="${track.trackId}" disabled>
          ${escapeHtml(track.trackName)}
        </button>
      `,
    )
    .join("");

  elements.choices.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => answer(Number(button.dataset.trackId), button));
  });
}

function playCurrentTrack() {
  if (state.answered) return;
  window.clearInterval(state.countdownTimerId);
  state.audio.src = state.correctTrack.previewUrl;
  state.audio.currentTime = 0;
  state.audio.load();
  elements.playButton.disabled = true;
  elements.choices.classList.add("countdown-preview");
  let count = 3;
  showCountdown(count);
  state.countdownTimerId = window.setInterval(() => {
    count -= 1;
    if (count > 0) {
      showCountdown(count);
      return;
    }
    window.clearInterval(state.countdownTimerId);
    startQuestionPlayback();
  }, 1000);
}

function showCountdown(count) {
  elements.playButton.textContent = String(count);
  elements.resultTitle.textContent = String(count);
  elements.resultMeta.textContent = "カウントダウン中...";
}

function startQuestionPlayback() {
  state.audio.src = state.correctTrack.previewUrl;
  state.audio.currentTime = 0;
  state.audio
    .play()
    .then(() => {
      state.startedAt = performance.now();
      state.timerId = window.setInterval(updateTimer, 40);
      elements.playButton.textContent = "再生中";
      elements.resultTitle.textContent = "この曲は？";
      elements.resultMeta.textContent = "選択肢から回答してください。";
      elements.choices.classList.remove("countdown-preview");
      elements.choices.querySelectorAll("button").forEach((button) => {
        button.disabled = false;
      });
    })
    .catch(() => {
      showToast("音源を再生できませんでした。もう一度再生を押してください。");
      elements.resultTitle.textContent = "この曲は？";
      elements.resultMeta.textContent = `${state.currentMode.label}モード。再生ボタンを押すとカウントダウンします。`;
      elements.playButton.disabled = false;
      elements.playButton.textContent = "再生";
    });
}

function updateTimer() {
  if (!state.startedAt) return;
  elements.timerValue.textContent = ((performance.now() - state.startedAt) / 1000).toFixed(2);
}

function answer(trackId, button) {
  if (state.answered || !state.startedAt) return;
  state.answered = true;
  const elapsed = (performance.now() - state.startedAt) / 1000;
  state.totalTime += elapsed;
  window.clearInterval(state.timerId);
  stopAudio();

  elements.choices.querySelectorAll("button").forEach((choice) => {
    const isAnswer = Number(choice.dataset.trackId) === state.correctTrack.trackId;
    choice.disabled = true;
    if (isAnswer) choice.classList.add("correct");
  });
  if (trackId === state.correctTrack.trackId) {
    state.correctCount += 1;
  } else {
    button.classList.add("wrong");
  }
  elements.artwork.classList.remove("hidden");
  elements.timerValue.textContent = elapsed.toFixed(2);
  elements.resultTitle.textContent = state.correctTrack.trackName;
  elements.resultMeta.innerHTML = `
    ${escapeHtml(state.correctTrack.artistName)} / ${elapsed.toFixed(2)}秒<br>
    <a class="store-link" href="${escapeHtml(state.correctTrack.trackViewUrl)}" target="_blank" rel="noreferrer">Apple/iTunesで見る</a>
  `;
  playAnswerSound(trackId === state.correctTrack.trackId);
  elements.nextButton.textContent = state.questionIndex === state.tracks.length - 1 ? "結果を見る" : "次の問題";
  elements.nextButton.classList.remove("hidden");
}

function nextQuestion() {
  if (state.questionIndex < state.tracks.length - 1) {
    state.questionIndex += 1;
    loadQuestion();
    return;
  }

  const entry = {
    player: state.player,
    topicId: state.currentTopic.id,
    topic: state.currentTopic.name,
    mode: state.currentMode.id,
    modeLabel: state.currentMode.label,
    time: Number(state.totalTime.toFixed(2)),
    correctCount: state.correctCount,
    totalQuestions: state.tracks.length,
    date: new Date().toISOString(),
  };
  if (entry.correctCount === entry.totalQuestions) saveRanking(entry);
  state.lastEntry = entry;
  route("result");
}

function saveRanking(entry) {
  const currentRankings = getRankings(entry.topicId, entry.mode);
  const rankings = currentRankings.filter((item) => item.player !== entry.player);
  const previousEntry = currentRankings.find((item) => item.player === entry.player);
  const nextEntry = previousEntry && previousEntry.time <= entry.time ? previousEntry : entry;
  rankings.push(nextEntry);
  rankings.sort((a, b) => a.time - b.time);
  const key = rankingKey(entry.topicId, entry.mode);
  const bestRankings = rankings.slice(0, 20);
  localStorage.setItem(key, JSON.stringify(bestRankings));
  saveSharedRanking(key, bestRankings);
}

function getRankings(topicId = state.currentTopic?.id, modeId = state.rankingModeId) {
  try {
    return JSON.parse(localStorage.getItem(rankingKey(topicId, modeId)) || "[]").filter(
      (entry) => entry.correctCount === entry.totalQuestions,
    );
  } catch {
    return [];
  }
}

function renderResult() {
  const entry = state.lastEntry;
  if (!entry) {
    route("home");
    return;
  }
  const rankings = getRankings(entry.topicId, entry.mode);
  const rank = rankings.findIndex((item) => item.date === entry.date) + 1;
  elements.resultTopic.textContent = entry.topic;
  elements.finalTime.textContent = entry.time.toFixed(2);
  elements.resultMeta.textContent = `${entry.modeLabel} / 正解数 ${entry.correctCount} / ${entry.totalQuestions}`;
  elements.resultRankText.textContent =
    rank > 0 ? `${entry.topic} / ${entry.modeLabel} の ${rank}位に入りました。` : "全問正解ではないためランキングには記録されません。";
  const topic = getTopic(entry.topicId);
  const liked = isTopicLiked(topic);
  elements.resultLikeButton.classList.toggle("liked", liked);
  elements.resultLikeButton.textContent = `♥ ${topic?.likes || 0}`;
}

function postResult() {
  if (!state.lastEntry) return;
  const text = `イントロポストで「${state.lastEntry.topic}」${state.lastEntry.modeLabel}を${state.lastEntry.time.toFixed(2)}秒でクリア！`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noreferrer");
}

function renderRanking() {
  const rankings = getRankings();
  const hasTopic = Boolean(state.currentTopic);
  elements.rankingTitle.textContent = hasTopic ? `${state.currentTopic.name} ランキング` : "ランキング";
  elements.rankingDescription.textContent = hasTopic
    ? `${getModeLabel(state.rankingModeId)}モードのベストタイム`
    : "お題を選んでプレイすると、そのお題のランキングが表示されます";
  renderRankingModeTabs();
  if (!rankings.length) {
    elements.rankingList.innerHTML = hasTopic
      ? "<li><span>-</span><strong>このモードの記録はまだありません</strong><span>--</span></li>"
      : "<li><span>-</span><strong>まだ表示するお題がありません</strong><span>--</span></li>";
    return;
  }

  elements.rankingList.innerHTML = rankings
    .map(
      (entry, index) => `
        <li>
          <span>#${index + 1}</span>
          <strong>${escapeHtml(entry.player)} / ${escapeHtml(entry.topic)}</strong>
          <span>${entry.time.toFixed(2)}秒</span>
        </li>
      `,
    )
    .join("");
}

function renderRankingModeTabs() {
  elements.rankingModeTabs.innerHTML = gameModes
    .map(
      (mode) => `
        <button class="mode-tab ${mode.id === state.rankingModeId ? "active" : ""}" data-ranking-mode="${mode.id}" type="button">
          ${mode.label}
        </button>
      `,
    )
    .join("");
  elements.rankingModeTabs.querySelectorAll("[data-ranking-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.rankingModeId = button.dataset.rankingMode;
      renderRanking();
    });
  });
}

function clearRanking() {
  localStorage.removeItem(rankingKey(state.currentTopic?.id, state.rankingModeId));
  renderRanking();
}

function retryLastTopic() {
  if (!state.currentTopic) return route("home");
  startGame(state.currentTopic.id, state.currentMode);
}

function renderMyData() {
  const targetUser = state.profilePageUser || state.player;
  const isOwnPage = !state.profilePageUser || state.profilePageUser === state.player;
  const records = getAllRankingRecords();
  const playerRecords = targetUser ? records.filter((entry) => entry.player === targetUser) : records;
  const sorted = [...playerRecords].sort((a, b) => a.time - b.time);
  const myTopics = targetUser ? state.topics.filter((topic) => topic.creator === targetUser) : [];
  elements.profileIconInput.value = state.profileIcon;
  elements.profileNameInput.value = state.player;
  elements.profileSettingsButton.classList.toggle("hidden", !isOwnPage);
  elements.myPageTitle.textContent = targetUser || "ゲスト";
  elements.mypageName.textContent = targetUser || "ゲスト";
  renderUserAvatar(elements.mypageAvatar, "user-avatar", targetUser);
  elements.mypageInfo.textContent = `${playerRecords.length}プレイ / ${myTopics.length}お題`;
  elements.myDataPlayer.textContent = "";
  elements.myTotalPlays.textContent = String(playerRecords.length);
  elements.myBestTime.textContent = sorted[0] ? `${sorted[0].time.toFixed(2)}秒` : "--";
  elements.myTopCount.textContent = String(getFirstPlaceCount(targetUser, records));
  elements.mypageSidePlays.textContent = String(playerRecords.length);
  elements.mypageSideBest.textContent = sorted[0] ? `${sorted[0].time.toFixed(2)}秒` : "--";
  elements.mypageSideTop.textContent = String(getFirstPlaceCount(targetUser, records));
  elements.mypageSideTopics.textContent = String(myTopics.length);
  elements.myDataList.innerHTML = sorted.length
    ? sorted
        .slice(0, 20)
        .map(
          (entry, index) => `
            <li class="record-link" data-topic-id="${escapeHtml(entry.topicId)}">
              <span>#${index + 1}</span>
              <strong>${escapeHtml(entry.topic)} / ${escapeHtml(entry.modeLabel)}</strong>
              <span>${entry.time.toFixed(2)}秒</span>
            </li>
          `,
        )
        .join("")
    : "<li><span>-</span><strong>まだ記録がありません</strong><span>--</span></li>";

  elements.myTopicList.innerHTML = myTopics.length
    ? myTopics
        .map(
          (topic) => `
            <li>
              <div class="topic-list-button topic-row no-rank" data-topic-id="${topic.id}">
                ${topicImageHtml(topic, "topic-thumb")}
                <strong>${escapeHtml(topic.name)}</strong>
                <small>${escapeHtml(topic.genre)} / ${topic.tracks.length}曲 / ♥ ${topic.likes || 0}</small>
                <span class="status-badge ${topic.published ? "published" : "draft"}">${topic.published ? "公開中" : "非公開"}</span>
                ${creatorButton(topic)}
                <button class="ghost-button" data-edit-topic="${topic.id}" type="button">編集</button>
              </div>
            </li>
          `,
        )
        .join("")
    : `<li class="empty-state">作成したお題はまだありません</li>`;
}

function renderProfileSettings() {
  elements.profileIconInput.value = state.profileIcon;
  elements.profileNameInput.value = state.player;
  renderAvatar(elements.settingsAvatar, "user-avatar");
}

function saveProfile() {
  const selectedImage = elements.profileImageInput.files?.[0];
  const previousPlayer = state.player;
  state.player = elements.profileNameInput.value.trim();
  state.profileIcon = elements.profileIconInput.value.trim();
  localStorage.setItem("introKingPlayer", state.player);
  localStorage.setItem("introKingProfileIcon", state.profileIcon);

  if (!selectedImage) {
    updateMyTopicProfile(previousPlayer);
    renderPlayer();
    renderMyData();
    renderProfileSettings();
    showToast("プロフィールを保存しました。");
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.profileImage = String(reader.result || "");
    localStorage.setItem("introKingProfileImage", state.profileImage);
    elements.profileImageInput.value = "";
    updateMyTopicProfile(previousPlayer);
    renderPlayer();
    renderMyData();
    renderProfileSettings();
    showToast("プロフィール画像を保存しました。");
  });
  reader.readAsDataURL(selectedImage);
}

function updateMyTopicProfile(previousPlayer = state.player) {
  state.topics.forEach((topic) => {
    if (topic.creator !== previousPlayer && topic.creator !== state.player) return;
    if (previousPlayer && topic.creator === previousPlayer) topic.creator = state.player;
    topic.creatorIcon = state.profileIcon;
    topic.creatorImage = state.profileImage;
  });
  saveTopics();
}

function getAllRankingRecords() {
  return getStorageKeys()
    .filter((key) => key.startsWith("introKingRankings:"))
    .flatMap((key) => {
      try {
        return JSON.parse(localStorage.getItem(key) || "[]");
      } catch {
        return [];
      }
    });
}

function getStorageKeys() {
  return Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter(Boolean);
}

function getFirstPlaceCount(player, records) {
  if (!player) return 0;
  const topByTopicMode = new Map();
  records.forEach((entry) => {
    const key = `${entry.topicId}:${entry.mode}`;
    const current = topByTopicMode.get(key);
    if (!current || entry.time < current.time) topByTopicMode.set(key, entry);
  });
  return [...topByTopicMode.values()].filter((entry) => entry.player === player).length;
}

function renderPlayer() {
  renderAvatar(elements.myDataButton, "icon-button");
  renderAuthState();
}

function renderAuthState() {
  const loggedIn = Boolean(state.player);
  elements.loginButton.classList.toggle("hidden", loggedIn);
  elements.myDataButton.classList.toggle("hidden", !loggedIn);
  elements.createTopicButton.classList.toggle("hidden", !loggedIn);
}

function renderAvatar(element, className) {
  const fallback = state.profileIcon || (state.player ? state.player.slice(0, 1).toUpperCase() : "人");
  element.className = className;
  element.innerHTML = state.profileImage
    ? `<img src="${escapeHtml(state.profileImage)}" alt="" />`
    : escapeHtml(fallback);
}

function renderUserAvatar(element, className, userName) {
  const topic = state.topics.find((item) => item.creator === userName);
  element.className = className;
  if (userName === state.player) {
    renderAvatar(element, className);
    return;
  }
  const image = topic?.creatorImage || "";
  const icon = topic?.creatorIcon || (userName ? userName.slice(0, 1).toUpperCase() : "人");
  element.innerHTML = image ? `<img src="${escapeHtml(image)}" alt="" />` : escapeHtml(icon);
}

function route(name) {
  window.location.hash = name;
  syncRoute();
}

function syncRoute() {
  const name = window.location.hash.replace("#", "") || "home";
  if ((name === "myData" || name === "profileSettings" || name === "create") && !state.player) {
    route("home");
    openLoginDialog();
    return;
  }
  document.body.classList.toggle("create-mode", name === "create");
  Object.entries(views).forEach(([key, view]) => {
    view.classList.toggle("active", key === name);
  });
  if (name === "home") renderHome();
  if (name === "genre") renderGenrePage();
  if (name === "mode") renderModeSelect();
  if (name === "topicDetail") renderTopicDetail();
  if (name === "result") renderResult();
  if (name === "ranking") renderRanking();
  if (name === "myData") renderMyData();
  if (name === "profileSettings") renderProfileSettings();
  if (name !== "game") stopAudio();
}

function getTopic(topicId) {
  return state.topics.find((topic) => topic.id === topicId);
}

function stopAudio() {
  window.clearInterval(state.timerId);
  window.clearInterval(state.countdownTimerId);
  state.audio.pause();
}

function largerArtwork(url) {
  return url ? url.replace("100x100bb", "300x300bb") : "";
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => elements.toast.classList.remove("show"), 3200);
}

function getModeLabel(modeId) {
  return gameModes.find((mode) => mode.id === modeId)?.label || "中級";
}

function rankingKey(topicId, modeId = "normal") {
  return `introKingRankings:${modeId}:${topicId || "all"}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function initApp() {
  await loadTopics();
  await loadSharedRankings();
  renderPlayer();
  bindEvents();
  syncRoute();
}

initApp();
