import { useState, useEffect, useRef } from "react";
import {
  Star, Heart, Search, Plus, Pencil, Trash2, X, LogOut,
  Film, Tv, User, ChevronRight, Eye, EyeOff, ArrowLeft,
  BookOpen, Menu, Check, AlertCircle
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "landing" | "login" | "register" | "home" | "movies" | "series" | "detail" | "mylist" | "admin";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  mediaId: string;
  rating: number;
  text: string;
  date: string;
}

interface MediaItem {
  id: string;
  type: "movie" | "series";
  title: string;
  genre: string;
  year: number;
  description: string;
  director: string;
  cast: string[];
  duration: string;
  colorA: string;
  colorB: string;
}

// ─── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_MEDIA: MediaItem[] = [
  { id: "m1", type: "movie", title: "The Dark Knight", genre: "Ação", year: 2008, description: "Bruce Wayne enfrenta o Coringa, um criminoso que semeia o caos absoluto em Gotham City e desafia tudo que o herói representa.", director: "Christopher Nolan", cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Gary Oldman"], duration: "152 min", colorA: "#1a1a2e", colorB: "#16213e" },
  { id: "m2", type: "movie", title: "Vingadores: Ultimato", genre: "Ação", year: 2019, description: "Os heróis sobreviventes se unem em uma última e desesperada missão para reverter os danos causados por Thanos.", director: "Anthony e Joe Russo", cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson", "Mark Ruffalo"], duration: "181 min", colorA: "#2d1b69", colorB: "#11998e" },
  { id: "m3", type: "movie", title: "Mad Max: Estrada da Fúria", genre: "Ação", year: 2015, description: "Em um deserto pós-apocalíptico, Max ajuda a guerreira Furiosa a libertar mulheres escravizadas por um tirano.", director: "George Miller", cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"], duration: "120 min", colorA: "#b92b27", colorB: "#1565c0" },
  { id: "m4", type: "movie", title: "Get Out", genre: "Terror", year: 2017, description: "Um jovem negro visita a família de sua namorada branca e começa a perceber algo profundamente perturbador.", director: "Jordan Peele", cast: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford"], duration: "104 min", colorA: "#0f0c29", colorB: "#302b63" },
  { id: "m5", type: "movie", title: "Hereditário", genre: "Terror", year: 2018, description: "Após a morte da matriarca, a família Graham começa a desvendar segredos sombrios e uma herança macabra.", director: "Ari Aster", cast: ["Toni Collette", "Gabriel Byrne", "Milly Shapiro"], duration: "127 min", colorA: "#141414", colorB: "#3d0000" },
  { id: "m6", type: "movie", title: "Interstellar", genre: "Ficção Científica", year: 2014, description: "Uma equipe de exploradores viaja por um buraco de minhoca em busca de um novo lar para a humanidade.", director: "Christopher Nolan", cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], duration: "169 min", colorA: "#0a3d62", colorB: "#141e30" },
  { id: "m7", type: "movie", title: "Inception", genre: "Ficção Científica", year: 2010, description: "Um ladrão especializado em roubar segredos de sonhos recebe a missão impossível de plantar uma ideia.", director: "Christopher Nolan", cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"], duration: "148 min", colorA: "#12c2e9", colorB: "#1a1a2e" },
  { id: "m8", type: "movie", title: "O Poderoso Chefão", genre: "Drama", year: 1972, description: "O patriarca de uma família da máfia italiana transfere o controle de seu império criminoso para o filho relutante.", director: "Francis Ford Coppola", cast: ["Marlon Brando", "Al Pacino", "James Caan"], duration: "175 min", colorA: "#2c1654", colorB: "#141414" },
  { id: "m9", type: "movie", title: "Forrest Gump", genre: "Drama", year: 1994, description: "A extraordinária vida de um homem simples do Alabama que testemunha e participa de eventos históricos americanos.", director: "Robert Zemeckis", cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"], duration: "142 min", colorA: "#005c97", colorB: "#363795" },
  { id: "m10", type: "movie", title: "La La Land", genre: "Romance", year: 2016, description: "Um pianista de jazz e uma atriz aspirante se apaixonam enquanto perseguem seus sonhos em Los Angeles.", director: "Damien Chazelle", cast: ["Ryan Gosling", "Emma Stone", "J.K. Simmons"], duration: "128 min", colorA: "#9b59b6", colorB: "#3498db" },
  { id: "m11", type: "movie", title: "Grand Budapest Hotel", genre: "Comédia", year: 2014, description: "As aventuras do concierge de um famoso hotel europeu e seu fiel lobby boy em meio a guerras e intrigas.", director: "Wes Anderson", cast: ["Ralph Fiennes", "Tony Revolori", "Saoirse Ronan"], duration: "99 min", colorA: "#c94b4b", colorB: "#4b134f" },
  { id: "m12", type: "movie", title: "Parasita", genre: "Comédia", year: 2019, description: "Uma família pobre elabora um plano para se infiltrar na vida de uma rica família sul-coreana.", director: "Bong Joon-ho", cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"], duration: "132 min", colorA: "#1d976c", colorB: "#0a3d62" },
  { id: "s1", type: "series", title: "Breaking Bad", genre: "Drama", year: 2008, description: "Um professor de química se transforma em um implacável fabricante de drogas após um diagnóstico terminal.", director: "Vince Gilligan", cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"], duration: "5 temporadas", colorA: "#4b6cb7", colorB: "#182848" },
  { id: "s2", type: "series", title: "Stranger Things", genre: "Terror", year: 2016, description: "Um grupo de crianças enfrenta forças sobrenaturais vindas do Mundo Invertido em uma pequena cidade americana.", director: "Matt e Ross Duffer", cast: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"], duration: "4 temporadas", colorA: "#0f0c29", colorB: "#302b63" },
  { id: "s3", type: "series", title: "Game of Thrones", genre: "Ação", year: 2011, description: "Famílias nobres travam guerras brutais pelo controle do Trono de Ferro e dos Sete Reinos de Westeros.", director: "D.B. Weiss e D. Benioff", cast: ["Emilia Clarke", "Kit Harington", "Peter Dinklage"], duration: "8 temporadas", colorA: "#141e30", colorB: "#243b55" },
  { id: "s4", type: "series", title: "The Boys", genre: "Ação", year: 2019, description: "Um grupo de vigilantes sem poderes tenta derrubar super-heróis corporativos corruptos e violentos.", director: "Eric Kripke", cast: ["Karl Urban", "Jack Quaid", "Antony Starr"], duration: "4 temporadas", colorA: "#780206", colorB: "#061161" },
  { id: "s5", type: "series", title: "Dark", genre: "Ficção Científica", year: 2017, description: "Quatro famílias interligadas numa cidade alemã descobrem uma conspiração de viagem no tempo que atravessa gerações.", director: "Baran bo Odar", cast: ["Louis Hofmann", "Lisa Vicari", "Maja Schöne"], duration: "3 temporadas", colorA: "#0f0c29", colorB: "#0a3d62" },
  { id: "s6", type: "series", title: "Succession", genre: "Drama", year: 2018, description: "Os filhos de um magnata da mídia combatem-se pelo controle de uma dinastia global de comunicações.", director: "Jesse Armstrong", cast: ["Brian Cox", "Jeremy Strong", "Sarah Snook"], duration: "4 temporadas", colorA: "#1a1a1a", colorB: "#3d3d3d" },
  { id: "s7", type: "series", title: "Black Mirror", genre: "Ficção Científica", year: 2011, description: "Antologia perturbadora que explora as consequências sombrias da tecnologia moderna na sociedade.", director: "Charlie Brooker", cast: ["Toby Kebbell", "Bryce Dallas Howard", "Jon Hamm"], duration: "6 temporadas", colorA: "#000000", colorB: "#434343" },
  { id: "s8", type: "series", title: "Peaky Blinders", genre: "Drama", year: 2013, description: "A família Shelby, uma gangue de Birmingham no pós-guerra, ascende ao poder criminal e político.", director: "Steven Knight", cast: ["Cillian Murphy", "Helen McCrory", "Tom Hardy"], duration: "6 temporadas", colorA: "#2c1654", colorB: "#4a1942" },
  { id: "s9", type: "series", title: "Squid Game", genre: "Ação", year: 2021, description: "Centenas de pessoas endividadas participam de jogos infantis mortais por um prêmio milionário.", director: "Hwang Dong-hyuk", cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-jun"], duration: "2 temporadas", colorA: "#11998e", colorB: "#38ef7d" },
  { id: "s10", type: "series", title: "Ozark", genre: "Drama", year: 2017, description: "Um contador é forçado a lavar dinheiro para um cartel mexicano e muda sua família para o interior.", director: "Bill Dubuque", cast: ["Jason Bateman", "Laura Linney", "Julia Garner"], duration: "4 temporadas", colorA: "#003366", colorB: "#1a1a2e" },
  { id: "s11", type: "series", title: "Fleabag", genre: "Comédia", year: 2016, description: "Uma mulher irreverente e autodestrutiva navega pela vida moderna em Londres com humor corrosivo.", director: "Phoebe Waller-Bridge", cast: ["Phoebe Waller-Bridge", "Sian Clifford", "Olivia Colman"], duration: "2 temporadas", colorA: "#b24592", colorB: "#f15f79" },
  { id: "s12", type: "series", title: "Narcos", genre: "Ação", year: 2015, description: "A saga real da ascensão e queda de Pablo Escobar e do cartel de Medellín contada por agentes da DEA.", director: "Chris Brancato", cast: ["Wagner Moura", "Boyd Holbrook", "Pedro Pascal"], duration: "3 temporadas", colorA: "#134e5e", colorB: "#71b280" },
];

const SEED_REVIEWS: Review[] = [
  { id: "r1", userId: "demo", userName: "João Silva", mediaId: "m1", rating: 5, text: "Obra-prima absoluta do cinema. Heath Ledger é simplesmente incomparável como Coringa. Um dos melhores filmes já feitos.", date: "2024-03-15" },
  { id: "r2", userId: "demo2", userName: "Ana Costa", mediaId: "m1", rating: 4, text: "Impressionante em todos os aspectos. A performance de Ledger eleva o filme a outro nível.", date: "2024-04-02" },
  { id: "r3", userId: "demo", userName: "João Silva", mediaId: "m6", rating: 5, text: "Visualmente deslumbrante e emocionalmente devastador. Nolan no seu melhor.", date: "2024-02-20" },
  { id: "r4", userId: "demo2", userName: "Ana Costa", mediaId: "s1", rating: 5, text: "A melhor série da história da televisão. Sem discussão possível.", date: "2024-05-10" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function avgRating(reviews: Review[], mediaId: string): number {
  const r = reviews.filter((x) => x.mediaId === mediaId);
  if (!r.length) return 0;
  return r.reduce((s, x) => s + x.rating, 0) / r.length;
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function Stars({ value, onChange, size = 20 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= (hover || value);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange?.(i)}
            onMouseEnter={() => onChange && setHover(i)}
            onMouseLeave={() => onChange && setHover(0)}
            className={onChange ? "cursor-pointer" : "cursor-default pointer-events-none"}
            style={{ color: filled ? "#f5c518" : "#3a3a42", transition: "color 0.15s" }}
          >
            <Star size={size} fill={filled ? "#f5c518" : "none"} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}

function PosterCard({
  item,
  reviews,
  isFav,
  onClick,
  onToggleFav,
}: {
  item: MediaItem;
  reviews: Review[];
  isFav: boolean;
  onClick: () => void;
  onToggleFav: (e: React.MouseEvent) => void;
}) {
  const avg = avgRating(reviews, item.id);
  const count = reviews.filter((r) => r.mediaId === item.id).length;

  return (
    <div
      onClick={onClick}
      className="group relative rounded-lg overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ background: `linear-gradient(135deg, ${item.colorA}, ${item.colorB})` }}
    >
      {/* poster area */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-4"
          style={{ background: `linear-gradient(160deg, ${item.colorA}dd, ${item.colorB}ee)` }}
        >
          <div className="text-6xl mb-3 opacity-20">{item.type === "movie" ? "🎬" : "📺"}</div>
          <p
            className="text-center font-bold leading-tight text-white/90 text-sm"
            style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
          >
            {item.title}
          </p>
          <span className="mt-2 text-xs text-white/50 uppercase tracking-widest">{item.genre}</span>
        </div>

        {/* fav button */}
        <button
          onClick={onToggleFav}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/80"
        >
          <Heart size={14} fill={isFav ? "#e50914" : "none"} color={isFav ? "#e50914" : "white"} />
        </button>

        {/* year badge */}
        <span className="absolute top-2 left-2 text-xs bg-black/60 backdrop-blur-sm text-white/70 px-2 py-0.5 rounded-full">
          {item.year}
        </span>

        {/* overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-medium text-sm flex items-center gap-1.5">
            <Eye size={14} /> Ver detalhes
          </span>
        </div>
      </div>

      {/* info */}
      <div className="p-3 bg-card/80 backdrop-blur-sm">
        <p className="font-semibold text-sm text-foreground truncate">{item.title}</p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <Stars value={Math.round(avg)} size={11} />
            <span className="text-xs text-muted-foreground ml-1">
              {avg > 0 ? avg.toFixed(1) : "—"} ({count})
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{item.duration}</span>
        </div>
      </div>
    </div>
  );
}

function Navbar({
  user,
  onNavigate,
  currentPage,
  onLogout,
}: {
  user: UserAccount | null;
  onNavigate: (p: Page) => void;
  currentPage: Page;
  onLogout: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (label: string, page: Page, icon: React.ReactNode) => (
    <button
      onClick={() => { onNavigate(page); setMenuOpen(false); }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
        currentPage === page
          ? "bg-primary/20 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => onNavigate(user ? "home" : "landing")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <Film size={14} color="white" />
          </div>
          <span className="font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            CineCatálogo
          </span>
        </button>

        {user && (
          <>
            <nav className="hidden md:flex items-center gap-1">
              {navLink("Início", "home", <Film size={14} />)}
              {navLink("Filmes", "movies", <Film size={14} />)}
              {navLink("Séries", "series", <Tv size={14} />)}
              {navLink("Minha Lista", "mylist", <Heart size={14} />)}
              {navLink("Admin", "admin", <Plus size={14} />)}
            </nav>

            <div className="flex items-center gap-3">
              <span className="hidden md:block text-sm text-muted-foreground">
                Olá, <span className="text-foreground font-medium">{user.name.split(" ")[0]}</span>
              </span>
              <button
                onClick={onLogout}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
              <button
                className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* mobile menu */}
      {menuOpen && user && (
        <div className="md:hidden border-t border-border bg-background/95 px-4 py-3 flex flex-col gap-1">
          {navLink("Início", "home", <Film size={14} />)}
          {navLink("Filmes", "movies", <Film size={14} />)}
          {navLink("Séries", "series", <Tv size={14} />)}
          {navLink("Minha Lista", "mylist", <Heart size={14} />)}
          {navLink("Admin", "admin", <Plus size={14} />)}
        </div>
      )}
    </header>
  );
}

// ─── Pages ──────────────────────────────────────────────────────────────────────

function LandingPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* hero */}
      <div
        className="relative flex-1 flex items-center"
        style={{
          background: "linear-gradient(135deg, #0d0d0f 0%, #1a0a2e 50%, #0a1628 100%)",
          minHeight: "100vh",
        }}
      >
        {/* background film strip accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-white/3"
              style={{ left: `${12 + i * 12}%`, top: 0, bottom: 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center w-full">
          {/* left – signup form */}
          <div className="order-1">
            <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-3 py-1 mb-6">
              <Film size={12} className="text-primary" />
              <span className="text-xs text-primary font-medium uppercase tracking-wider">CineCatálogo</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}>
              Descubra e avalie<br />
              <span className="text-primary">filmes e séries</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Entre para nossa plataforma de catálogo de filmes e séries. Avalie, escreva resenhas e crie sua lista pessoal.
            </p>

            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 max-w-sm">
              <h2 className="text-lg font-semibold text-foreground mb-1">Inscreva-se</h2>
              <p className="text-sm text-muted-foreground mb-5">Crie sua conta gratuitamente</p>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nome de usuário"
                  className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  readOnly
                  onFocus={() => onNavigate("register")}
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  readOnly
                  onFocus={() => onNavigate("register")}
                />
                <button
                  onClick={() => onNavigate("register")}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Inscreva-se agora <ChevronRight size={16} />
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Já tem conta?{" "}
                <button onClick={() => onNavigate("login")} className="text-primary hover:underline">
                  Entrar
                </button>
              </p>
            </div>
          </div>

          {/* right – featured posters collage */}
          <div className="order-2 hidden md:grid grid-cols-2 gap-3 opacity-90">
            {[
              { title: "The Dark Knight", year: "2008", colorA: "#1a1a2e", colorB: "#16213e", emoji: "🦇" },
              { title: "Interstellar", year: "2014", colorA: "#0a3d62", colorB: "#141e30", emoji: "🚀" },
              { title: "Breaking Bad", year: "2008", colorA: "#4b6cb7", colorB: "#182848", emoji: "⚗️" },
              { title: "Stranger Things", year: "2016", colorA: "#0f0c29", colorB: "#302b63", emoji: "👾" },
            ].map((p, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden border border-white/10 ${i === 0 ? "row-span-2" : ""}`}
                style={{ background: `linear-gradient(160deg, ${p.colorA}, ${p.colorB})`, aspectRatio: i === 0 ? "2/3" : "16/10" }}
              >
                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-4xl mb-2">{p.emoji}</div>
                  <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "var(--font-display)" }}>{p.title}</p>
                  <span className="text-white/40 text-xs mt-1">{p.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="border-t border-border py-6 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 CineCatálogo · Desenvolvido por{" samuel, topazio, rafel e fernanda "}
          <span className="text-foreground font-medium">chupa pau</span>
        </p>
      </footer>
    </div>
  );
}

function AuthPage({
  mode,
  onSuccess,
  onSwitch,
  users,
  onRegister,
}: {
  mode: "login" | "register";
  onSuccess: (user: UserAccount) => void;
  onSwitch: () => void;
  users: UserAccount[];
  onRegister: (u: UserAccount) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError("Preencha todos os campos.");
        return;
      }
      if (password.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres.");
        return;
      }
      if (users.find((u) => u.email === email)) {
        setError("E-mail já cadastrado.");
        return;
      }
      const newUser: UserAccount = { id: genId(), name: name.trim(), email: email.trim(), password };
      onRegister(newUser);
      onSuccess(newUser);
    } else {
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) {
        setError("E-mail ou senha incorretos.");
        return;
      }
      onSuccess(found);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0d0d0f, #1a0a2e 60%, #0a1628)" }}
    >
      <div className="w-full max-w-sm">
        {/* logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto flex items-center justify-center mb-4">
            <Film size={24} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            CineCatálogo
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-xl p-6 space-y-4"
        >
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                <User size={13} className="inline mr-1.5 opacity-60" />
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-input-background border border-border rounded-lg px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              <AlertCircle size={13} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
          >
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button onClick={onSwitch} className="text-primary hover:underline font-medium">
            {mode === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}

function HomePage({
  media,
  reviews,
  favorites,
  onOpenDetail,
  onToggleFav,
  onNavigate,
}: {
  media: MediaItem[];
  reviews: Review[];
  favorites: Set<string>;
  onOpenDetail: (item: MediaItem) => void;
  onToggleFav: (id: string) => void;
  onNavigate: (p: Page) => void;
}) {
  const featuredMovies = media.filter((m) => m.type === "movie").slice(0, 4);
  const featuredSeries = media.filter((m) => m.type === "series").slice(0, 4);
  const topRated = [...media]
    .filter((m) => avgRating(reviews, m.id) > 0)
    .sort((a, b) => avgRating(reviews, b.id) - avgRating(reviews, a.id))
    .slice(0, 4);

  const Section = ({
    title,
    icon,
    items,
    linkPage,
  }: {
    title: string;
    icon: React.ReactNode;
    items: MediaItem[];
    linkPage: Page;
  }) => (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <button
          onClick={() => onNavigate(linkPage)}
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Ver todos <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <PosterCard
            key={item.id}
            item={item}
            reviews={reviews}
            isFav={favorites.has(item.id)}
            onClick={() => onOpenDetail(item)}
            onToggleFav={(e) => { e.stopPropagation(); onToggleFav(item.id); }}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* hero banner */}
      <div
        className="relative rounded-2xl overflow-hidden mb-10 border border-border"
        style={{ background: "linear-gradient(135deg, #1a0a2e, #0a1628 60%, #0d0d0f)" }}
      >
        <div className="p-8 md:p-12">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 mb-4">
            <Star size={11} fill="#f5c518" color="#f5c518" />
            <span className="text-xs text-primary font-medium">Em destaque</span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-3 max-w-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Explore o melhor do cinema e das séries
          </h1>
          <p className="text-muted-foreground max-w-md mb-6">
            Catálogo completo com avaliações, resenhas e sua lista personalizada de favoritos.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => onNavigate("movies")}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Film size={15} /> Explorar Filmes
            </button>
            <button
              onClick={() => onNavigate("series")}
              className="bg-white/10 hover:bg-white/15 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-white/10"
            >
              <Tv size={15} /> Explorar Séries
            </button>
          </div>
        </div>
      </div>

      {topRated.length > 0 && (
        <Section title="Melhor Avaliados" icon={<Star size={16} fill="#f5c518" color="#f5c518" />} items={topRated} linkPage="movies" />
      )}
      <Section title="Filmes em Destaque" icon={<Film size={16} className="text-primary" />} items={featuredMovies} linkPage="movies" />
      <Section title="Séries Populares" icon={<Tv size={16} className="text-primary" />} items={featuredSeries} linkPage="series" />
    </div>
  );
}

const GENRES = ["Todos", "Ação", "Terror", "Drama", "Ficção Científica", "Comédia", "Romance"];

function CatalogPage({
  type,
  media,
  reviews,
  favorites,
  onOpenDetail,
  onToggleFav,
}: {
  type: "movie" | "series";
  media: MediaItem[];
  reviews: Review[];
  favorites: Set<string>;
  onOpenDetail: (item: MediaItem) => void;
  onToggleFav: (id: string) => void;
}) {
  const [genre, setGenre] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"title" | "year" | "rating">("year");

  const filtered = media
    .filter((m) => m.type === type)
    .filter((m) => genre === "Todos" || m.genre === genre)
    .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "year") return b.year - a.year;
      return avgRating(reviews, b.id) - avgRating(reviews, a.id);
    });

  const availableGenres = ["Todos", ...Array.from(new Set(media.filter((m) => m.type === type).map((m) => m.genre)))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-foreground mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {type === "movie" ? "Catálogo de Filmes" : "Catálogo de Séries"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {filtered.length} {type === "movie" ? "filmes" : "séries"} encontrados
        </p>
      </div>

      {/* filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Buscar ${type === "movie" ? "filmes" : "séries"}...`}
            className="w-full bg-input-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60"
        >
          <option value="year">Mais recentes</option>
          <option value="rating">Melhor avaliados</option>
          <option value="title">Título A-Z</option>
        </select>
      </div>

      {/* genre tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {availableGenres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              genre === g
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Film size={40} className="mx-auto mb-3 opacity-20" />
          <p>Nenhum resultado encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <PosterCard
              key={item.id}
              item={item}
              reviews={reviews}
              isFav={favorites.has(item.id)}
              onClick={() => onOpenDetail(item)}
              onToggleFav={(e) => { e.stopPropagation(); onToggleFav(item.id); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DetailPage({
  item,
  reviews,
  favorites,
  currentUser,
  onToggleFav,
  onAddReview,
  onEditReview,
  onDeleteReview,
  onBack,
}: {
  item: MediaItem;
  reviews: Review[];
  favorites: Set<string>;
  currentUser: UserAccount;
  onToggleFav: (id: string) => void;
  onAddReview: (r: Review) => void;
  onEditReview: (r: Review) => void;
  onDeleteReview: (id: string) => void;
  onBack: () => void;
}) {
  const itemReviews = reviews.filter((r) => r.mediaId === item.id);
  const avg = avgRating(reviews, item.id);
  const isFav = favorites.has(item.id);
  const userReview = itemReviews.find((r) => r.userId === currentUser.id);

  const [rating, setRating] = useState(userReview?.rating ?? 0);
  const [text, setText] = useState(userReview?.text ?? "");
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setText(userReview.text);
    }
  }, [userReview]);

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!rating || !text.trim()) return;

    const reviewData: Review = {
      id: userReview?.id ?? genId(),
      userId: currentUser.id,
      userName: currentUser.name,
      mediaId: item.id,
      rating,
      text: text.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    if (userReview || editing) {
      onEditReview(reviewData);
    } else {
      onAddReview(reviewData);
    }
    setEditing(false);
    setShowForm(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Voltar
      </button>

      {/* header */}
      <div
        className="rounded-2xl overflow-hidden border border-border mb-8"
        style={{ background: `linear-gradient(135deg, ${item.colorA}, ${item.colorB})` }}
      >
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          {/* poster mini */}
          <div
            className="w-32 h-48 rounded-xl flex-shrink-0 flex flex-col items-center justify-center border border-white/10"
            style={{ background: `linear-gradient(160deg, ${item.colorA}cc, ${item.colorB}ee)` }}
          >
            <div className="text-5xl mb-2">{item.type === "movie" ? "🎬" : "📺"}</div>
            <span className="text-white/60 text-xs uppercase tracking-widest">{item.genre}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs bg-black/40 text-white/70 px-2 py-0.5 rounded-full">{item.year}</span>
              <span className="text-xs bg-black/40 text-white/70 px-2 py-0.5 rounded-full">{item.genre}</span>
              <span className="text-xs bg-black/40 text-white/70 px-2 py-0.5 rounded-full">{item.duration}</span>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.title}
            </h1>

            {avg > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Stars value={Math.round(avg)} size={18} />
                <span className="text-accent font-semibold">{avg.toFixed(1)}</span>
                <span className="text-white/50 text-sm">({itemReviews.length} avaliações)</span>
              </div>
            )}

            <p className="text-white/80 leading-relaxed mb-5 max-w-prose">{item.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-white/40 uppercase text-xs tracking-wider">Direção</span>
                <p className="text-white/90 font-medium">{item.director}</p>
              </div>
              <div>
                <span className="text-white/40 uppercase text-xs tracking-wider">Elenco</span>
                <p className="text-white/90">{item.cast.slice(0, 3).join(", ")}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onToggleFav(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isFav
                    ? "bg-primary/30 border border-primary/50 text-primary"
                    : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <Heart size={14} fill={isFav ? "#e50914" : "none"} />
                {isFav ? "Nos favoritos" : "Adicionar aos favoritos"}
              </button>
              {!userReview && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                >
                  <BookOpen size={14} /> Escrever resenha
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* review form */}
      {(showForm || editing) && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen size={15} className="text-primary" />
            {editing ? "Editar resenha" : "Sua resenha"}
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Avaliação</label>
              <Stars value={rating} onChange={setRating} size={22} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Comentário</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escreva sua opinião sobre este título..."
                rows={4}
                className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!rating || !text.trim()}
                className="bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Check size={14} /> {editing ? "Salvar alterações" : "Publicar resenha"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(false); setRating(userReview?.rating ?? 0); setText(userReview?.text ?? ""); }}
                className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* reviews list */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-primary" />
          Resenhas ({itemReviews.length})
        </h2>

        {itemReviews.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-xl">
            <BookOpen size={32} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Nenhuma resenha ainda. Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {itemReviews.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {r.userName[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.userName}</p>
                      <Stars value={r.rating} size={12} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                    {r.userId === currentUser.id && (
                      <>
                        <button
                          onClick={() => { setRating(r.rating); setText(r.text); setEditing(true); setShowForm(false); }}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteReview(r.id)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed pl-11">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MyListPage({
  media,
  reviews,
  favorites,
  onOpenDetail,
  onToggleFav,
}: {
  media: MediaItem[];
  reviews: Review[];
  favorites: Set<string>;
  onOpenDetail: (item: MediaItem) => void;
  onToggleFav: (id: string) => void;
}) {
  const [tab, setTab] = useState<"all" | "movie" | "series">("all");
  const favItems = media.filter((m) => favorites.has(m.id));
  const filtered = favItems.filter((m) => tab === "all" || m.type === tab);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Minha Lista
        </h1>
        <p className="text-muted-foreground text-sm">
          Seus filmes e séries favoritos ({favItems.length})
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "Todos" },
          { key: "movie", label: "Filmes" },
          { key: "series", label: "Séries" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              tab === t.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Heart size={48} className="mx-auto mb-4 opacity-15" />
          <p className="text-lg font-medium text-foreground mb-1">Lista vazia</p>
          <p className="text-sm">Adicione filmes e séries clicando no coração nos cards.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <PosterCard
              key={item.id}
              item={item}
              reviews={reviews}
              isFav={favorites.has(item.id)}
              onClick={() => onOpenDetail(item)}
              onToggleFav={(e) => { e.stopPropagation(); onToggleFav(item.id); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminPage({
  media,
  onAdd,
  onEdit,
  onDelete,
}: {
  media: MediaItem[];
  onAdd: (item: MediaItem) => void;
  onEdit: (item: MediaItem) => void;
  onDelete: (id: string) => void;
}) {
  const blank: Omit<MediaItem, "id"> = {
    type: "movie",
    title: "",
    genre: "Ação",
    year: new Date().getFullYear(),
    description: "",
    director: "",
    cast: [],
    duration: "",
    colorA: "#1a1a2e",
    colorB: "#16213e",
  };

  const [form, setForm] = useState<Omit<MediaItem, "id">>(blank);
  const [editId, setEditId] = useState<string | null>(null);
  const [castInput, setCastInput] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "movie" | "series">("all");
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = media
    .filter((m) => typeFilter === "all" || m.type === typeFilter)
    .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));

  function openEdit(item: MediaItem) {
    setForm({ type: item.type, title: item.title, genre: item.genre, year: item.year, description: item.description, director: item.director, cast: item.cast, duration: item.duration, colorA: item.colorA, colorB: item.colorB });
    setCastInput(item.cast.join(", "));
    setEditId(item.id);
    setShowForm(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    const castArray = castInput.split(",").map((s) => s.trim()).filter(Boolean);
    const itemData = { ...form, cast: castArray };

    if (editId) {
      onEdit({ ...itemData, id: editId });
    } else {
      onAdd({ ...itemData, id: genId() });
    }
    setForm(blank);
    setCastInput("");
    setEditId(null);
    setShowForm(false);
  }

  const colorPairs: Array<{ label: string; a: string; b: string }> = [
    { label: "Azul noite", a: "#1a1a2e", b: "#16213e" },
    { label: "Vermelho", a: "#780206", b: "#061161" },
    { label: "Verde escuro", a: "#134e5e", b: "#71b280" },
    { label: "Roxo", a: "#2c1654", b: "#4a1942" },
    { label: "Oceano", a: "#0a3d62", b: "#141e30" },
    { label: "Esmeralda", a: "#11998e", b: "#38ef7d" },
    { label: "Carvão", a: "#141414", b: "#3d0000" },
    { label: "Rosa", a: "#b24592", b: "#f15f79" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Administração
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Gerencie filmes e séries do catálogo</p>
        </div>
        <button
          onClick={() => { setForm(blank); setCastInput(""); setEditId(null); setShowForm(true); }}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={15} /> Adicionar
        </button>
      </div>

      {/* form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-base font-semibold text-foreground">
                {editId ? "Editar título" : "Novo título"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Tipo</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as "movie" | "series" })}
                    className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60"
                  >
                    <option value="movie">Filme</option>
                    <option value="series">Série</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Gênero</label>
                  <select
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60"
                  >
                    {GENRES.filter((g) => g !== "Todos").map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Título do filme/série"
                  required
                  className="w-full bg-input-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Ano</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: +e.target.value })}
                    min={1900}
                    max={2030}
                    className="w-full bg-input-background border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Duração</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="Ex: 120 min / 3 temporadas"
                    className="w-full bg-input-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Direção</label>
                <input
                  type="text"
                  value={form.director}
                  onChange={(e) => setForm({ ...form, director: e.target.value })}
                  placeholder="Nome do diretor"
                  className="w-full bg-input-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Elenco (separado por vírgula)</label>
                <input
                  type="text"
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  placeholder="Ator 1, Ator 2, Ator 3"
                  className="w-full bg-input-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Descrição *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Sinopse do título..."
                  rows={3}
                  required
                  className="w-full bg-input-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Cor do poster</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorPairs.map((cp) => (
                    <button
                      key={cp.label}
                      type="button"
                      onClick={() => setForm({ ...form, colorA: cp.a, colorB: cp.b })}
                      className={`h-10 rounded-lg relative overflow-hidden border-2 transition-all ${
                        form.colorA === cp.a ? "border-primary scale-105" : "border-transparent"
                      }`}
                      style={{ background: `linear-gradient(135deg, ${cp.a}, ${cp.b})` }}
                      title={cp.label}
                    >
                      {form.colorA === cp.a && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check size={14} color="white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {editId ? "Salvar alterações" : "Adicionar ao catálogo"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full">
            <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-destructive" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Confirmar exclusão</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Tem certeza que deseja remover este título do catálogo? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { onDelete(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Excluir
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar no catálogo..."
            className="w-full bg-input-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "movie", "series"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                typeFilter === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "all" ? "Todos" : t === "movie" ? "Filmes" : "Séries"}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 text-xs text-muted-foreground uppercase tracking-wider px-5 py-3 border-b border-border bg-muted/30">
          <span>Título</span>
          <span className="px-3">Tipo</span>
          <span className="px-3">Gênero</span>
          <span className="px-3">Ano</span>
          <span className="px-3">Ações</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Nenhum resultado.</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 items-center px-5 py-3.5 border-b border-border/50 hover:bg-white/2 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-10 rounded flex-shrink-0"
                  style={{ background: `linear-gradient(160deg, ${item.colorA}, ${item.colorB})` }}
                />
                <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
              </div>
              <span className="px-3 text-xs text-muted-foreground">
                {item.type === "movie" ? "Filme" : "Série"}
              </span>
              <span className="px-3 text-xs text-muted-foreground">{item.genre}</span>
              <span className="px-3 text-xs text-muted-foreground">{item.year}</span>
              <div className="px-3 flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(item.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-right">{filtered.length} títulos exibidos</p>
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(
    () => loadLS<UserAccount | null>("cc_user", null)
  );
  const [users, setUsers] = useState<UserAccount[]>(
    () => loadLS<UserAccount[]>("cc_users", [])
  );
  const [media, setMedia] = useState<MediaItem[]>(
    () => loadLS<MediaItem[]>("cc_media", SEED_MEDIA)
  );
  const [reviews, setReviews] = useState<Review[]>(
    () => loadLS<Review[]>("cc_reviews", SEED_REVIEWS)
  );
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(loadLS<string[]>("cc_favs", []))
  );
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [prevPage, setPrevPage] = useState<Page>("home");

  // Sync to localStorage
  useEffect(() => { saveLS("cc_user", currentUser); }, [currentUser]);
  useEffect(() => { saveLS("cc_users", users); }, [users]);
  useEffect(() => { saveLS("cc_media", media); }, [media]);
  useEffect(() => { saveLS("cc_reviews", reviews); }, [reviews]);
  useEffect(() => { saveLS("cc_favs", Array.from(favorites)); }, [favorites]);

  // Redirect if not authed
  useEffect(() => {
    if (!currentUser && page !== "landing" && page !== "login" && page !== "register") {
      setPage("landing");
    }
  }, [currentUser, page]);

  function navigate(p: Page) {
    if (p !== "detail") setPrevPage(page);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openDetail(item: MediaItem) {
    setSelectedItem(item);
    setPrevPage(page);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleFav(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function logout() {
    setCurrentUser(null);
    setFavorites(new Set());
    setPage("landing");
  }

  const isAuthed = !!currentUser;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* navbar only on authed pages */}
      {isAuthed && page !== "landing" && page !== "login" && page !== "register" && (
        <Navbar user={currentUser} onNavigate={navigate} currentPage={page} onLogout={logout} />
      )}

      <main>
        {page === "landing" && <LandingPage onNavigate={navigate} />}

        {(page === "login" || page === "register") && (
          <AuthPage
            mode={page}
            onSuccess={(u) => { setCurrentUser(u); navigate("home"); }}
            onSwitch={() => navigate(page === "login" ? "register" : "login")}
            users={users}
            onRegister={(u) => setUsers((prev) => [...prev, u])}
          />
        )}

        {isAuthed && page === "home" && (
          <HomePage
            media={media}
            reviews={reviews}
            favorites={favorites}
            onOpenDetail={openDetail}
            onToggleFav={toggleFav}
            onNavigate={navigate}
          />
        )}

        {isAuthed && page === "movies" && (
          <CatalogPage
            type="movie"
            media={media}
            reviews={reviews}
            favorites={favorites}
            onOpenDetail={openDetail}
            onToggleFav={toggleFav}
          />
        )}

        {isAuthed && page === "series" && (
          <CatalogPage
            type="series"
            media={media}
            reviews={reviews}
            favorites={favorites}
            onOpenDetail={openDetail}
            onToggleFav={toggleFav}
          />
        )}

        {isAuthed && page === "detail" && selectedItem && (
          <DetailPage
            item={selectedItem}
            reviews={reviews}
            favorites={favorites}
            currentUser={currentUser!}
            onToggleFav={toggleFav}
            onAddReview={(r) => setReviews((prev) => [...prev, r])}
            onEditReview={(r) => setReviews((prev) => prev.map((x) => (x.id === r.id ? r : x)))}
            onDeleteReview={(id) => setReviews((prev) => prev.filter((x) => x.id !== id))}
            onBack={() => navigate(prevPage)}
          />
        )}

        {isAuthed && page === "mylist" && (
          <MyListPage
            media={media}
            reviews={reviews}
            favorites={favorites}
            onOpenDetail={openDetail}
            onToggleFav={toggleFav}
          />
        )}

        {isAuthed && page === "admin" && (
          <AdminPage
            media={media}
            onAdd={(item) => setMedia((prev) => [...prev, item])}
            onEdit={(item) => setMedia((prev) => prev.map((m) => (m.id === item.id ? item : m)))}
            onDelete={(id) => setMedia((prev) => prev.filter((m) => m.id !== id))}
          />
        )}
      </main>
    </div>
  );
}
