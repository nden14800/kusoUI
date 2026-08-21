/**
 * Corporate Error Theatre: polished enterprise controls corrupted by intentional, safe UX friction.
 * Layout: level rail + experience stage + live telemetry. Signature color: Toxic Lime #C7FF00.
 */
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  CircleAlert,
  CircleX,
  Command,
  Crosshair,
  Gauge,
  LockKeyhole,
  MousePointer2,
  Play,
  RefreshCcw,
  Search,
  Settings2,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ScenarioKind =
  | "slider"
  | "runner"
  | "consent"
  | "meter"
  | "input"
  | "captcha"
  | "toggle"
  | "clock"
  | "choice"
  | "timeline"
  | "upload"
  | "search";

type Scenario = {
  level: number;
  title: string;
  subtitle: string;
  category: string;
  difficulty: number;
  kind: ScenarioKind;
};

type LogEntry = {
  id: number;
  message: string;
  tone: "neutral" | "danger" | "lime";
};

const heroImage = "./kuso-assets/kusoui-hero-control-room.png";
const brokenFormImage = "./kuso-assets/kusoui-card-broken-form.png";
const progressImage = "./kuso-assets/kusoui-card-progress-loop.png";
const logoImage = "./kuso-assets/kusoui-logo-symbol.png";

const scenarios: Scenario[] = [
  { level: 1, title: "電話番号スライダー", subtitle: "11桁を精密に探してください。", category: "INPUT", difficulty: 1, kind: "slider" },
  { level: 2, title: "跳ね回る同意ボタン", subtitle: "合意は、こちらから近づくものです。", category: "CONSENT", difficulty: 2, kind: "runner" },
  { level: 3, title: "逆心理アカウント削除", subtitle: "責任はあなたにあります。たぶん。", category: "DANGER", difficulty: 2, kind: "consent" },
  { level: 4, title: "不安になるダウンロード", subtitle: "99.9% は完了ではありません。", category: "WAIT", difficulty: 1, kind: "meter" },
  { level: 5, title: "究極の全角フォーム", subtitle: "半角を検出し次第、優しく破棄します。", category: "FORM", difficulty: 2, kind: "input" },
  { level: 6, title: "手動誕生日ピッカー", subtitle: "西暦0001年からご指定ください。", category: "TIME", difficulty: 2, kind: "timeline" },
  { level: 7, title: "重力音量調節", subtitle: "重力のない環境では利用できません。", category: "CONTROL", difficulty: 3, kind: "slider" },
  { level: 8, title: "時空を超える日付", subtitle: "過去は横方向にスクロールします。", category: "TIME", difficulty: 2, kind: "timeline" },
  { level: 9, title: "連動するスイッチ", subtitle: "一つ変えると、全部変わります。", category: "TOGGLE", difficulty: 2, kind: "toggle" },
  { level: 10, title: "不可能なパスワード", subtitle: "入力要件は毎秒変動します。", category: "SECURITY", difficulty: 4, kind: "input" },
  { level: 11, title: "ポップアップ祭り", subtitle: "通知は情報の花火です。", category: "ALERT", difficulty: 3, kind: "choice" },
  { level: 12, title: "動画広告の儀式", subtitle: "スキップ可能になるまでお待ちください。", category: "ADS", difficulty: 3, kind: "meter" },
  { level: 13, title: "終わらない画像認証", subtitle: "横断歩道の概念を再定義します。", category: "VERIFY", difficulty: 4, kind: "captcha" },
  { level: 14, title: "逃げるヘルプ", subtitle: "ヘルプが必要な時ほど、遠ざかります。", category: "HELP", difficulty: 2, kind: "runner" },
  { level: 15, title: "消える利用規約", subtitle: "最後まで読めたら、勝ちです。", category: "LEGAL", difficulty: 3, kind: "timeline" },
  { level: 16, title: "終わらないアップデート", subtitle: "改善のため、使用を中断します。", category: "WAIT", difficulty: 3, kind: "meter" },
  { level: 17, title: "遅延入力チャット", subtitle: "あなたの発言は熟成されています。", category: "CHAT", difficulty: 2, kind: "input" },
  { level: 18, title: "ロシアンルーレット送信", subtitle: "送信先は選べません。", category: "ACTION", difficulty: 4, kind: "choice" },
  { level: 19, title: "感覚的カラーピッカー", subtitle: "色名は感情で入力してください。", category: "FORM", difficulty: 2, kind: "input" },
  { level: 20, title: "確認ダイアログのループ", subtitle: "本当に、確認しますか？", category: "ALERT", difficulty: 3, kind: "consent" },
  { level: 21, title: "ホバーで逃げる選択肢", subtitle: "意思決定を軽やかに妨害します。", category: "CHOICE", difficulty: 3, kind: "runner" },
  { level: 22, title: "バッテリードレイン警告", subtitle: "省電力モードは電力を消費します。", category: "SYSTEM", difficulty: 2, kind: "toggle" },
  { level: 23, title: "逆走プログレスバー", subtitle: "進捗は後退することがあります。", category: "WAIT", difficulty: 2, kind: "meter" },
  { level: 24, title: "手動スクロール広告", subtitle: "広告を最後まで移動させてください。", category: "ADS", difficulty: 3, kind: "slider" },
  { level: 25, title: "偽電卓", subtitle: "計算結果は最も面白い方を採用します。", category: "UTILITY", difficulty: 2, kind: "choice" },
  { level: 26, title: "偽デジタル時計", subtitle: "時間は仕様に含まれません。", category: "TIME", difficulty: 1, kind: "clock" },
  { level: 27, title: "暴れ回るチェック", subtitle: "チェックは追いかけてください。", category: "FORM", difficulty: 3, kind: "runner" },
  { level: 28, title: "逆再生フォーム", subtitle: "入力内容は後ろから読まれます。", category: "FORM", difficulty: 2, kind: "input" },
  { level: 29, title: "3.00秒ジャスト待機", subtitle: "正確さに意味はありません。", category: "WAIT", difficulty: 3, kind: "meter" },
  { level: 30, title: "無理ゲーボール転がし", subtitle: "ボールはあなたを評価しています。", category: "GAME", difficulty: 4, kind: "slider" },
  { level: 31, title: "スクラッチ認証", subtitle: "読めない情報だけが安全です。", category: "VERIFY", difficulty: 4, kind: "captcha" },
  { level: 32, title: "大声入力システム", subtitle: "静かな場所では使用できません。", category: "INPUT", difficulty: 4, kind: "meter" },
  { level: 33, title: "合わせ鏡パスワード", subtitle: "文字列を自己反転してください。", category: "SECURITY", difficulty: 3, kind: "input" },
  { level: 34, title: "マトリョーシカ・ダイアログ", subtitle: "閉じるたび、次の確認が現れます。", category: "ALERT", difficulty: 4, kind: "consent" },
  { level: 35, title: "重力ドロップダウン", subtitle: "選択肢は下に落ちます。", category: "CHOICE", difficulty: 3, kind: "choice" },
  { level: 36, title: "自動消滅フォーム", subtitle: "作業内容を定期的に保護します。", category: "FORM", difficulty: 3, kind: "input" },
  { level: 37, title: "スロット選択", subtitle: "属性は運で決まります。", category: "CHOICE", difficulty: 3, kind: "choice" },
  { level: 38, title: "1ピクセル・ボタン", subtitle: "アクセシビリティは顕微鏡対応です。", category: "ACTION", difficulty: 5, kind: "runner" },
  { level: 39, title: "物理演算キーボード", subtitle: "キーが逃げても責任を負いません。", category: "INPUT", difficulty: 4, kind: "captcha" },
  { level: 40, title: "偽ブラックスクリーン", subtitle: "復旧を模した展示です。", category: "SYSTEM", difficulty: 5, kind: "clock" },
  { level: 41, title: "AI無断要約フォーム", subtitle: "入力前に要点を決定します。", category: "AI", difficulty: 3, kind: "input" },
  { level: 42, title: "全拒否する通知設定", subtitle: "許可の反対は、さらに許可です。", category: "TOGGLE", difficulty: 3, kind: "toggle" },
  { level: 43, title: "記憶を失うカート", subtitle: "商品は覚えていません。", category: "COMMERCE", difficulty: 3, kind: "choice" },
  { level: 44, title: "見えない必須項目", subtitle: "必須事項は画面外にあります。", category: "FORM", difficulty: 4, kind: "input" },
  { level: 45, title: "二段階目だけの認証", subtitle: "第一段階は省略しました。", category: "SECURITY", difficulty: 4, kind: "captcha" },
  { level: 46, title: "更新され続ける規約", subtitle: "同意中に内容が変わります。", category: "LEGAL", difficulty: 4, kind: "timeline" },
  { level: 47, title: "100%失敗するアップロード", subtitle: "完了と成功は別の概念です。", category: "UPLOAD", difficulty: 3, kind: "upload" },
  { level: 48, title: "比較不能なプラン表", subtitle: "比較表を比較不能にしました。", category: "PRICING", difficulty: 2, kind: "choice" },
  { level: 49, title: "信頼度99%の嘘エラー", subtitle: "ほぼ確実に失敗しています。", category: "SYSTEM", difficulty: 3, kind: "meter" },
  { level: 50, title: "勝手に並び替わる検索", subtitle: "関連性は自由です。", category: "SEARCH", difficulty: 3, kind: "search" },
  { level: 51, title: "ミュート不能なモーダル", subtitle: "静寂のためのお知らせです。", category: "ALERT", difficulty: 4, kind: "consent" },
  { level: 52, title: "無意味なローディング年表", subtitle: "待機の歴史をお届けします。", category: "WAIT", difficulty: 2, kind: "timeline" },
  { level: 53, title: "視線追跡のふり広告", subtitle: "見ていなくても見られています。", category: "ADS", difficulty: 4, kind: "runner" },
  { level: 54, title: "完璧な失敗レポート", subtitle: "失敗を成功として提出します。", category: "FINAL", difficulty: 5, kind: "upload" },
];

function levelCode(level: number) {
  return String(level).padStart(2, "0");
}

function ScenarioStage({
  scenario,
  onComplete,
  onLog,
  reducedMotion,
}: {
  scenario: Scenario;
  onComplete: () => void;
  onLog: (message: string, tone?: LogEntry["tone"]) => void;
  reducedMotion: boolean;
}) {
  const [sliderValue, setSliderValue] = useState(47);
  const [inputValue, setInputValue] = useState("");
  const [runnerOffset, setRunnerOffset] = useState(55);
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [dialogStep, setDialogStep] = useState(0);
  const [progress, setProgress] = useState(18);
  const [searchTerm, setSearchTerm] = useState("");

  const reportComplete = (message = "展示は意図的に失敗しました。") => {
    onComplete();
    onLog(message, "lime");
  };

  const showAction = () => {
    switch (scenario.kind) {
      case "slider":
        return (
          <div className="scenario-module slider-module">
            <div className="module-eyebrow"><SlidersHorizontal size={14} /> CALIBRATION REQUIRED</div>
            <div className="huge-value">{String(sliderValue).padStart(3, "0")}</div>
            <p>正しい値は <strong>不明</strong> です。ドラッグすると安心感だけが増加します。</p>
            <input aria-label="誤作動する数値スライダー" className="toxic-range" type="range" min="0" max="100" value={sliderValue} onChange={(event) => setSliderValue(Number(event.target.value))} />
            <div className="range-labels"><span>安心</span><span>絶望</span><span>更なる絶望</span></div>
            <button className="primary-action" onClick={() => reportComplete("キャリブレーションは仕様通り無視されました。")}>値を確定 <ArrowUpRight size={16} /></button>
          </div>
        );
      case "runner":
        return (
          <div className="scenario-module runner-module">
            <div className="module-eyebrow"><MousePointer2 size={14} /> PRECISION INTERACTION</div>
            <p>このボタンは、あなたの決意を検出すると少しだけ距離を取ります。</p>
            <div className="runner-field" aria-label="逃げるボタンの展示">
              <button
                className="escaping-button"
                style={{ left: `${runnerOffset}%` }}
                onMouseEnter={() => {
                  setRunnerOffset((current) => (current > 58 ? 8 : current + 29));
                  onLog("ボタンがユーザーの善意を検知しました。", "danger");
                }}
                onClick={() => reportComplete("クリック判定が到達しました。例外として記録します。")}
              >
                同意する
              </button>
              <Crosshair className="runner-crosshair" size={42} />
            </div>
            <button className="quiet-action" onClick={() => reportComplete("代替ルートが勝手に閉じられました。")}>正攻法をあきらめる</button>
          </div>
        );
      case "consent":
        return (
          <div className="scenario-module consent-module">
            <div className="module-eyebrow"><ShieldAlert size={14} /> LEGAL EVENT</div>
            <h3>最後の確認、または最初の後悔</h3>
            <p>削除、通知許可、モーダル閉鎖のいずれにも同程度の重みがあります。</p>
            <div className="consent-stack">
              {[
                ["継続する", "安全そうに見える選択"],
                ["キャンセル", "実際には継続する選択"],
                ["考え直す", "第2確認を開く選択"],
              ].map(([label, description], index) => (
                <button key={label} className={index === dialogStep ? "consent-choice selected" : "consent-choice"} onClick={() => {
                  setDialogStep(index);
                  onLog(`${label} が選択されました。意味は保持されません。`, "danger");
                }}>
                  <span><b>{label}</b><small>{description}</small></span><ChevronRight size={19} />
                </button>
              ))}
            </div>
            <button className="primary-action" onClick={() => reportComplete("確認処理を 3 件追加しました。")}>この選択をさらに確認する <ChevronRight size={16} /></button>
          </div>
        );
      case "meter":
      case "upload":
        return (
          <div className="scenario-module meter-module">
            <div className="module-eyebrow"><Activity size={14} /> {scenario.kind === "upload" ? "TRANSFER / EXPECT FAILURE" : "UNLIMITED PROGRESS"}</div>
            <div className="progress-number">{progress > 96 ? "99.9" : progress.toFixed(1)}<span>%</span></div>
            <div className="progress-rail"><motion.div className="progress-fill" animate={{ width: `${Math.min(progress, 99.9)}%` }} transition={{ duration: reducedMotion ? 0 : 0.35 }} /></div>
            <div className="progress-meta"><span>残り {progress > 94 ? "∞ 年" : `${Math.ceil((100 - progress) / 2)} 世紀`}</span><span>安定性: {progress > 70 ? "低下中" : "未測定"}</span></div>
            <p>{scenario.kind === "upload" ? "ファイルはアップロード済みですが、成功したとは限りません。" : "進行度は進みますが、終了条件はありません。"}</p>
            <button className="primary-action" onClick={() => {
              setProgress((value) => Math.min(99.9, value + 28));
              if (progress > 70) reportComplete("99.9% 到達後に静かに失敗しました。");
              else onLog("安心感を 28% 加算しました。", "neutral");
            }}>{scenario.kind === "upload" ? "転送を続行" : "待機を加速"} <Zap size={16} /></button>
          </div>
        );
      case "input":
        return (
          <div className="scenario-module input-module">
            <div className="module-eyebrow"><Bot size={14} /> OPTIMIZED DATA ENTRY</div>
            <label className="field-label">{scenario.title.includes("パスワード") ? "禁止文字列" : "人間用の自由入力"}</label>
            <input
              className="kuso-input"
              value={inputValue}
              placeholder="ここへ入力すると、少しだけ不安になります"
              onChange={(event) => {
                const next = event.target.value;
                setInputValue(next.length > 16 ? "" : next);
                if (next.length === 4) onLog("入力内容は品質向上のため反対順に保存されました。", "danger");
              }}
            />
            <div className="input-diagnostics">
              <span>FORMAT: {inputValue ? "あと少しで不正" : "未定義"}</span>
              <span>TRUST: {inputValue ? "0.3" : "0.0"}</span>
            </div>
            <div className="warning-banner"><CircleAlert size={16} /> {inputValue ? "入力の自由度が高すぎます。" : "必須ですが、何を入れるかは秘密です。"}</div>
            <button className="primary-action" onClick={() => reportComplete("入力値は慎重に捨てられました。")}>検証に提出 <ArrowUpRight size={16} /></button>
          </div>
        );
      case "captcha":
        return (
          <div className="scenario-module captcha-module">
            <div className="module-eyebrow"><LockKeyhole size={14} /> HUMAN VERIFICATION</div>
            <h3>「微妙に怪しいもの」をすべて選択</h3>
            <p>AIにも説明できない直感を求めています。</p>
            <div className="captcha-grid">
              {Array.from({ length: 9 }, (_, index) => (
                <button key={index} className={selectedCells.includes(index) ? "captcha-cell selected" : "captcha-cell"} onClick={() => {
                  setSelectedCells((cells) => cells.includes(index) ? cells.filter((cell) => cell !== index) : [...cells, index]);
                }}>
                  <span>{["◉", "╳", "△", "◌", "◈", "⊙", "◇", "○", "✦"][index]}</span>
                </button>
              ))}
            </div>
            <div className="input-diagnostics"><span>{selectedCells.length}/9 SELECTED</span><span>MODEL: CONFUSED</span></div>
            <button className="primary-action" onClick={() => reportComplete(`${selectedCells.length} 個の誤答を自信をもって受付けました。`)}>私はたぶん人間です <Check size={16} /></button>
          </div>
        );
      case "toggle":
        return (
          <div className="scenario-module toggle-module">
            <div className="module-eyebrow"><Settings2 size={14} /> CONSENT ORCHESTRATION</div>
            <h3>お好みの設定を無効化</h3>
            <p>スイッチを操作すると、関連のない設定も最適化されます。</p>
            {["重要なお知らせを減らす", "個人の選択を尊重する", "通知を静かにする"].map((label, index) => (
              <button key={label} className="toggle-line" onClick={() => {
                setIsEnabled(!isEnabled);
                onLog(`設定 ${index + 1} は別の設定へ移管されました。`, "danger");
              }}>
                <span><b>{label}</b><small>推奨値: 有効に見える無効</small></span>
                <span className={isEnabled ? "fake-toggle on" : "fake-toggle"}><i /></span>
              </button>
            ))}
            <button className="primary-action" onClick={() => reportComplete("選択は慎重に反転されました。")}>反映しない <RefreshCcw size={16} /></button>
          </div>
        );
      case "clock":
        return (
          <div className="scenario-module clock-module">
            <div className="module-eyebrow"><Gauge size={14} /> TEMPORAL SERVICE</div>
            <div className="digital-time">08:99:61</div>
            <p>この時計は現在の時刻と関係ありません。<br />しかし、確信だけはあります。</p>
            <div className="time-card"><span>TIMEZONE</span><b>UTC+??</b><span>SYNC</span><b className="lime-text">PERHAPS</b></div>
            <button className="primary-action" onClick={() => reportComplete("時刻を 1 分ほど誤差補正しました。")}>現在地を同期 <Activity size={16} /></button>
          </div>
        );
      case "timeline":
        return (
          <div className="scenario-module timeline-module">
            <div className="module-eyebrow"><Activity size={14} /> HISTORICAL LOADING</div>
            <h3>処理の長い道のり</h3>
            <p>完了予定を説明するために、経緯を共有します。</p>
            <div className="timeline-list">
              {["利用者の期待を取得", "期待を見失う", "再計算に同意を要求", "ほぼ完了を演出"].map((item, index) => <div className={index === 2 ? "timeline-item active" : "timeline-item"} key={item}><span>{levelCode(index + 1)}</span><b>{item}</b><i /></div>)}
            </div>
            <button className="primary-action" onClick={() => reportComplete("年表を追加しましたが、処理は変わりません。")}>年表を承認 <ChevronRight size={16} /></button>
          </div>
        );
      case "search":
        return (
          <div className="scenario-module search-module">
            <div className="module-eyebrow"><Search size={14} /> RELEVANCE ENGINE</div>
            <label className="field-label">検索したいと思ったもの</label>
            <div className="search-field"><Search size={18} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="例: まともなUI" /></div>
            <div className="search-results">
              {["広告を先に表示", "検索語を忘れる", "最も離れた結果", "同じ結果をもう一度"].map((result, index) => <button key={result} onClick={() => onLog(`検索結果 ${index + 1} を無関係として強調しました。`, "danger")}><span>{levelCode(index + 1)}</span><b>{result}</b><ArrowUpRight size={15} /></button>)}
            </div>
            <button className="primary-action" onClick={() => reportComplete(`「${searchTerm || "未入力"}」に関連しない結果を確定しました。`)}>これで探す <ArrowUpRight size={16} /></button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.section
      className="experience-stage"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
      transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="stage-topline"><span>EXHIBIT / {levelCode(scenario.level)}</span><span className="live-signal"><i /> LIVE SIMULATION</span></div>
      <div className="stage-heading"><div><span className="scenario-category">{scenario.category}</span><h2>{scenario.title}</h2><p>{scenario.subtitle}</p></div><div className="difficulty-mark" aria-label={`難易度 ${scenario.difficulty} / 5`}><span>RISK</span><b>{"!".repeat(scenario.difficulty)}</b></div></div>
      <div className="error-stack"><span>ERR_STACK / 0x{(scenario.level * 403).toString(16).toUpperCase()}</span><b>摩擦指数は正常に悪化しています。</b><i>ACKNOWLEDGED BY NOBODY</i></div>
      <div className="stage-body">{showAction()}</div>
      <div className="stage-footer"><span><CircleAlert size={14} /> これは安全な展示です。外部操作・離脱阻止・権限要求は行いません。</span><span>NODE: KUSO-{levelCode(scenario.level)}-E</span></div>
    </motion.section>
  );
}

export default function Home() {
  const [activeLevel, setActiveLevel] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [railOpen, setRailOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, message: "制御室を起動しました。現実への影響はありません。", tone: "lime" },
    { id: 2, message: "54 件の展示がオンラインです。", tone: "neutral" },
    { id: 3, message: "失敗耐性: 意図的に高め。", tone: "danger" },
  ]);

  const activeScenario = scenarios.find((scenario) => scenario.level === activeLevel) ?? scenarios[0];
  const filteredScenarios = useMemo(() => scenarios.filter((scenario) => `${scenario.title} ${scenario.category} ${scenario.level}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const addLog = (message: string, tone: LogEntry["tone"] = "neutral") => {
    setLogs((entries) => [{ id: Date.now(), message, tone }, ...entries].slice(0, 5));
  };

  const selectScenario = (level: number) => {
    setActiveLevel(level);
    setRailOpen(false);
    setPaletteOpen(false);
    addLog(`展示 ${levelCode(level)} をロードしました。`, "neutral");
  };

  const markComplete = () => {
    setCompleted((levels) => levels.includes(activeLevel) ? levels : [...levels, activeLevel]);
  };

  const resetExperience = () => {
    setCompleted([]);
    addLog("展示履歴を上品に破棄しました。", "danger");
  };

  return (
    <main className={reducedMotion ? "kuso-shell reduced-motion" : "kuso-shell"}>
      <div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" /><div className="noise-layer" />
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="KusoUI トップへ戻る"><img src={logoImage} alt="" /><span>kuso<span>UI</span></span><i>ANTI-UX / MUSEUM</i></a>
        <div className="header-status"><span className="status-dot" /> SYSTEMS NOMINALLY ONLINE</div>
        <div className="header-actions"><button className="header-button shortcut-button" onClick={() => setPaletteOpen(true)}><Command size={15} /><span>展示を検索</span><kbd>⌘K</kbd></button><button className="icon-button" aria-label="シナリオ一覧を開く" onClick={() => setRailOpen(true)}><Settings2 size={18} /></button></div>
      </header>

      <section id="top" className="hero-strip">
        <img src={heroImage} alt="" />
        <div className="hero-content"><p className="micro-label"><Sparkles size={14} /> INTERACTIVE EXHIBITION / VOL. 11</p><h1>使いにくさを、<br /><em>過剰に。</em></h1><p>最悪のUIパターンを、最高に整った制御室から体験する。<br />ここではすべてが壊れていて、いつでも安全に戻れます。</p><div className="hero-ctas"><button className="hero-primary" onClick={() => selectScenario(1)}><Play size={16} fill="currentColor" /> 展示を開始</button><button className="hero-secondary" onClick={() => setPaletteOpen(true)}>54 の展示を見る <ArrowUpRight size={16} /></button></div><div className="hero-audit"><span><b>98.7%</b> 監査済み失敗</span><i /><span><b>01</b> 回復経路を確保</span><i /><span>FRICTION: <b>RISING</b></span></div></div>
        <div className="hero-tape"><span>UNSAFE BY DESIGN</span><span>UNSAFE BY DESIGN</span><span>UNSAFE BY DESIGN</span></div>
        <div className="hero-stamp"><span>LIVE</span><b>54</b><small>EXPERIMENTS</small></div>
      </section>

      <div className="control-layout">
        <aside className={railOpen ? "level-rail open" : "level-rail"} aria-label="シナリオ一覧">
          <div className="rail-head"><div><span>EXHIBIT INDEX</span><b>LEVEL RAIL</b></div><button className="icon-button rail-close" aria-label="シナリオ一覧を閉じる" onClick={() => setRailOpen(false)}><X size={18} /></button></div>
          <div className="rail-progress"><div><span>COMPLETE</span><b>{String(completed.length).padStart(2, "0")} / 54</b></div><div className="rail-progress-line"><i style={{ width: `${(completed.length / scenarios.length) * 100}%` }} /></div></div>
          <div className="rail-taxonomy"><span>ARCHIVE STATUS</span><b>収蔵済みの摩擦 <i>54</i></b></div><nav className="scenario-nav">{scenarios.map((scenario) => <button key={scenario.level} className={scenario.level === activeLevel ? "rail-item current" : completed.includes(scenario.level) ? "rail-item completed" : "rail-item"} onClick={() => selectScenario(scenario.level)}><span>{levelCode(scenario.level)}</span><i>{completed.includes(scenario.level) ? <Check size={12} /> : scenario.difficulty}</i><b>{scenario.title}</b></button>)}</nav>
          <button className="rail-reset" onClick={resetExperience}><RefreshCcw size={14} /> 記録を初期化</button>
        </aside>

        <section className="stage-column">
          <div className="mode-bar"><span><span className="mode-dot" /> CONTROL ROOM</span><span>LEVEL {levelCode(activeLevel)} / {levelCode(scenarios.length)}</span></div>
          <AnimatePresence mode="wait"><ScenarioStage key={activeScenario.level} scenario={activeScenario} onComplete={markComplete} onLog={addLog} reducedMotion={reducedMotion} /></AnimatePresence>
          <section className="exhibit-shelf"><div className="shelf-title"><span>SELECTED ARTIFACTS</span><b>失敗の造形</b></div><article className="artifact-card"><img src={brokenFormImage} alt="壊れたフォームを抽象化した展示ビジュアル" /><div><span>FIELD STUDY / 05</span><h3>FORM, UNMADE</h3><p>入力を歓迎しながら、入力の自由を奪う。</p></div></article><article className="artifact-card inverted"><img src={progressImage} alt="終わらない進捗を抽象化した展示ビジュアル" /><div><span>FIELD STUDY / 23</span><h3>99.9 FOREVER</h3><p>ゴール直前の安心だけを永続化する。</p></div></article></section>
        </section>

        <aside className="telemetry-panel" aria-label="体験テレメトリ"><div className="telemetry-head"><div><span>REALTIME TELEMETRY</span><b>観測ログ</b></div><Activity size={18} /></div><div className="telemetry-metric"><span>FRICTION INDEX</span><strong>{String(activeScenario.difficulty * 19 + 4).padStart(3, "0")}</strong><i>↑ 容赦なし</i></div><div className="telemetry-metric compact"><span>ESCAPE ROUTES</span><strong>01</strong><i>確保済み</i></div><div className="log-window"><div className="log-title"><span>EVENT STREAM</span><span>●</span></div>{logs.map((log) => <p className={`log-entry ${log.tone}`} key={log.id}><i />{log.message}</p>)}</div><div className="motion-control"><div><span>CALM MODE</span><small>視覚演出を抑える</small></div><button className={reducedMotion ? "fake-toggle on" : "fake-toggle"} onClick={() => setReducedMotion(!reducedMotion)} aria-label="動きを抑える"><i /></button></div><div className="safety-note"><ShieldAlert size={17} /><p><b>SAFE BY DESIGN</b> 本サイトはブラウザを閉じる操作、戻る操作、通知やマイクなどの権限を妨げません。</p></div></aside>
      </div>

      <footer className="site-footer"><p>KusoUI — a controlled study in avoidable digital friction.</p><span>NO TRACKING / NO TRAPS / JUST BAD UI</span></footer>

      <AnimatePresence>{paletteOpen && <motion.div className="command-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.currentTarget === event.target) setPaletteOpen(false); }}><motion.div className="command-palette" initial={{ opacity: 0, y: reducedMotion ? 0 : 18, scale: reducedMotion ? 1 : 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reducedMotion ? 0 : 8 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}><div className="command-input"><Search size={19} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="展示名、カテゴリ、番号を入力" /><button onClick={() => { setPaletteOpen(false); setQuery(""); }} aria-label="閉じる"><X size={18} /></button></div><div className="command-caption"><span>EXHIBIT LOOKUP</span><span>{filteredScenarios.length} FOUND</span></div><div className="command-results">{filteredScenarios.slice(0, 9).map((scenario) => <button key={scenario.level} onClick={() => { selectScenario(scenario.level); setQuery(""); }}><span>{levelCode(scenario.level)}</span><div><b>{scenario.title}</b><small>{scenario.category} · {scenario.subtitle}</small></div><ChevronRight size={18} /></button>)}</div></motion.div></motion.div>}</AnimatePresence>
      <button className="mobile-rail-trigger" onClick={() => setRailOpen(true)}><Settings2 size={17} /> LEVELS <span>{levelCode(activeLevel)}</span></button>
    </main>
  );
}
