<template>
  <div class="min-h-screen font-body selection:bg-indigo-500/30">
    <!-- TopAppBar -->
    <header class="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-md shadow-md h-24 transition-all duration-300 flex items-center border-b border-white/10">
      <nav class="flex justify-between items-center w-full max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex items-center gap-3">
          <!-- Logo UMSA -->
          <img alt="Logo UMSA" class="h-16 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] brightness-200" src="/images/logotipo_letras.png" />
        </div>
        <div class="hidden md:flex items-center space-x-10 font-body">
          <a v-for="item in menuItems" :key="item.href" :href="item.href" class="relative text-white/80 hover:text-white font-semibold tracking-tight transition-colors duration-300 group">
            {{ item.label }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#818cf8] to-[#c084fc] transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
        <div class="flex items-center gap-4">
          <router-link to="/auth/login" class="px-7 py-2.5 rounded-full border border-white/30 text-white font-body font-semibold hover:bg-white hover:text-[#0f172a] hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-300 text-sm tracking-wide">
            Iniciar Sesión
          </router-link>
        </div>
      </nav>
    </header>

    <main class="relative z-10">
      <!-- 1. Hero Section (Oscuro con Video) -->
      <section class="relative min-h-[100vh] flex items-center justify-center px-8 text-center overflow-hidden bg-[#0f172a]">
        <!-- Video Background -->
        <video autoplay loop muted playsinline class="absolute top-0 left-0 w-full h-full object-cover z-0">
          <source src="/images/umsavideo.mp4" type="video/mp4" />
        </video>
        <!-- Dark Overlay -->
        <div class="absolute top-0 left-0 w-full h-full bg-[#0f172a]/80 z-0"></div>
        
        <div class="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center mt-16 animate-fade-in-up">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wide mb-6 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-[#818cf8] animate-pulse"></span>
            Plataforma Oficial
          </div>
          <h1 class="text-5xl lg:text-7xl font-extrabold text-white leading-[1.15] tracking-tighter mb-6 font-headline">
            Sistema de Gestión de <br /> 
            <span class="bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-transparent font-light italic">Pasantías</span> UMSA
          </h1>
          <p class="text-lg text-gray-300 max-w-2xl leading-relaxed font-body mb-10 font-medium">
            Facilitamos el puente entre la excelencia académica y el mundo profesional, brindando a los estudiantes de la Universidad Mayor de San Andrés las mejores oportunidades de crecimiento.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <router-link to="/auth/bienvenida" class="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-[#818cf8] to-[#c084fc] text-white font-bold text-lg hover:brightness-110 hover:-translate-y-1 shadow-[0_0_20px_rgba(129,140,248,0.4)] transition-all duration-300 border border-white/10">
              Comenzar Ahora
            </router-link>
            <router-link to="/auth/login" class="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-white/30 bg-transparent text-white font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
              Ya tengo cuenta
            </router-link>
          </div>
        </div>
      </section>

      <!-- 2. Bento Grid for Mision, Vision, Objetivos, Quienes Somos (Fondo Claro) -->
      <section class="w-full bg-neutral px-8 py-24 relative z-10 text-secondary">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-extrabold font-headline tracking-tighter text-secondary">Nuestra Identidad</h2>
            <p class="text-gray-500 mt-4 max-w-2xl mx-auto font-body">Conoce los pilares que impulsan el desarrollo del talento universitario hacia el éxito profesional.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <!-- Misión -->
            <div class="p-10 rounded-3xl bg-white border border-gray-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#818cf8]/10 transition-all duration-500 text-center flex flex-col items-center h-full group" id="mision">
              <div class="w-16 h-16 rounded-2xl bg-[#818cf8]/10 flex items-center justify-center mb-6 border border-[#818cf8]/20 text-[#818cf8] group-hover:scale-110 transition-transform duration-500">
                <v-icon icon="mdi-book-open-page-variant-outline" size="32"></v-icon>
              </div>
              <div class="relative z-10 flex flex-col flex-grow">
                <h2 class="text-2xl font-extrabold text-secondary mb-4 font-headline">Misión</h2>
                <p class="text-base text-gray-600 leading-relaxed font-body max-w-md mx-auto">
                  {{ info?.mision || 'Nuestra misión es gestionar y promover programas de pasantías de alta calidad que integren el conocimiento teórico con la práctica profesional.' }}
                </p>
              </div>
            </div>

            <!-- Visión -->
            <div class="p-10 rounded-3xl bg-white border border-gray-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#818cf8]/10 transition-all duration-500 text-center flex flex-col items-center h-full group" id="vision">
              <div class="w-16 h-16 rounded-2xl bg-[#818cf8]/10 flex items-center justify-center mb-6 border border-[#818cf8]/20 text-[#818cf8] group-hover:scale-110 transition-transform duration-500">
                <v-icon icon="mdi-eye-outline" size="32"></v-icon>
              </div>
              <div class="relative z-10 flex flex-col flex-grow">
                <h2 class="text-2xl font-extrabold text-secondary mb-4 font-headline">Visión</h2>
                <p class="text-base text-gray-600 leading-relaxed font-body max-w-md mx-auto">
                  {{ info?.vision || 'Ser el referente nacional en la gestión de talento joven, reconocidos por nuestra eficiencia en la vinculación académica-empresarial.' }}
                </p>
              </div>
            </div>

            <!-- Objetivos -->
            <div class="p-10 rounded-3xl bg-white border border-gray-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#818cf8]/10 transition-all duration-500 text-center flex flex-col items-center h-full group" id="objetivos">
              <div class="w-16 h-16 rounded-2xl bg-[#818cf8]/10 flex items-center justify-center mb-6 border border-[#818cf8]/20 text-[#818cf8] group-hover:scale-110 transition-transform duration-500">
                <v-icon icon="mdi-flag-variant-outline" size="32"></v-icon>
              </div>
              <div class="relative z-10 flex flex-col flex-grow">
                <h2 class="text-2xl font-extrabold text-secondary mb-4 font-headline">Nuestros Objetivos</h2>
                <p class="text-base text-gray-600 leading-relaxed font-body max-w-md mx-auto">
                  {{ info?.objetivos || 'Estructuramos cada paso del proceso para garantizar que tu transición al mercado laboral sea exitosa y significativa.' }}
                </p>
              </div>
            </div>

            <!-- Quiénes Somos -->
            <div class="p-10 rounded-3xl bg-white border border-gray-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#818cf8]/10 transition-all duration-500 text-center flex flex-col items-center h-full group" id="quienes-somos">
              <div class="w-16 h-16 rounded-2xl bg-[#818cf8]/10 flex items-center justify-center mb-6 border border-[#818cf8]/20 text-[#818cf8] group-hover:scale-110 transition-transform duration-500">
                <v-icon icon="mdi-account-group-outline" size="32"></v-icon>
              </div>
              <div class="relative z-10 flex flex-col flex-grow">
                <h2 class="text-2xl font-extrabold text-secondary mb-4 font-headline">¿Quiénes Somos?</h2>
                <div class="space-y-4 text-base text-gray-600 leading-relaxed font-body max-w-md mx-auto">
                  <p v-if="info?.quienes_somos">{{ info.quienes_somos }}</p>
                  <template v-else>
                    <p>La Unidad de Gestión de Pasantías de la UMSA es el órgano encargado de articular las necesidades del sector productivo con el talento emergente.</p>
                    <p>Con más de dos décadas de experiencia, aseguramos que cada pasantía sea una experiencia transformadora.</p>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Empresas Aliadas Section (Fondo Oscuro) -->
      <section v-if="empresas.length" class="w-full bg-[#0f172a] px-8 py-24 relative z-10 text-white">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl lg:text-4xl font-extrabold text-white mb-12 font-headline text-center tracking-tighter">
            Empresas en <span class="bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">Convenio</span>
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div v-for="empresa in empresas" :key="empresa.id_empresa" @click="abrirModal(empresa)" class="p-6 rounded-2xl bg-[#1e293b] border border-white/5 hover:border-[#818cf8]/50 hover:shadow-lg hover:shadow-[#818cf8]/10 transition-all duration-300 flex flex-col items-center justify-center group cursor-pointer">
              <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                <img v-if="empresa.logo" :src="empresa.logo" :alt="empresa.nombre" class="w-full h-full object-cover" />
                <v-icon v-else icon="mdi-domain" size="24" class="text-[#818cf8]"></v-icon>
              </div>
              <h3 class="text-sm font-bold text-white text-center">{{ empresa.nombre }}</h3>
              <p class="text-xs text-gray-400 mt-1 text-center">{{ empresa.rubro }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. CTAs (Fondo Claro) -->
      <section class="w-full bg-white px-8 py-24 relative z-10 text-secondary border-t border-gray-100">
        <div class="max-w-5xl mx-auto">
          <div class="bg-neutral rounded-[2.5rem] p-12 lg:p-16 text-center relative overflow-hidden shadow-xl border border-gray-200">
            <!-- Decoración -->
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#818cf8] via-transparent to-transparent"></div>
            
            <h2 class="text-3xl lg:text-4xl font-extrabold mb-4 font-headline text-secondary tracking-tighter relative z-10">¿Listo para dar el primer paso?</h2>
            <p class="text-lg mb-10 text-gray-600 max-w-xl mx-auto font-body relative z-10">Regístrate hoy y accede a la red de pasantías más prestigiosa de Bolivia.</p>
            <div class="flex flex-col sm:flex-row justify-center gap-5 relative z-10">
              <router-link to="/auth/bienvenida" class="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#818cf8] to-[#c084fc] text-white font-bold text-lg hover:brightness-110 transition-all shadow-lg hover:-translate-y-0.5">
                Registrarse
              </router-link>
              <router-link to="/auth/registro-empresa" class="px-8 py-3.5 rounded-full border-2 border-gray-300 bg-white text-secondary font-bold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all">
                Portal de Empresas
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 5. Footer (Fondo Oscuro) -->
    <footer class="w-full py-12 bg-[#0f172a] border-t border-white/10 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-center px-12 max-w-7xl mx-auto space-y-6 md:space-y-0">
        <div class="flex items-center gap-3">
          <span class="font-headline font-extrabold text-white text-2xl tracking-tight">UMSA <span class="text-[#818cf8] font-light italic">Pasantías</span></span>
        </div>
        <div class="flex flex-wrap justify-center gap-8 font-body text-sm font-semibold text-gray-400">
          <a class="hover:text-white transition-colors duration-200" href="#">Privacidad</a>
          <a class="hover:text-white transition-colors duration-200" href="#">Términos</a>
          <a class="hover:text-white transition-colors duration-200" href="#">Contacto</a>
        </div>
        <div class="text-gray-500 text-sm font-body font-medium">
          © 2026 UMSA
        </div>
      </div>
    </footer>

    <!-- Modal Detalles Empresa -->
    <div v-if="empresaSeleccionada" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm" @click="cerrarModal"></div>
      
      <!-- Modal Content -->
      <div class="bg-[#1e293b] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 animate-fade-in-up border border-white/10">
        <!-- Header con imagen/color -->
        <div class="h-32 bg-gradient-to-r from-[#818cf8] to-[#c084fc] relative rounded-t-3xl">
          <button @click="cerrarModal" class="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm">
            <v-icon icon="mdi-close" size="20"></v-icon>
          </button>
          
          <div class="absolute -bottom-10 left-8 w-20 h-20 bg-[#0f172a] rounded-2xl shadow-lg flex items-center justify-center border border-white/20 overflow-hidden">
            <img v-if="empresaSeleccionada.logo" :src="empresaSeleccionada.logo" :alt="empresaSeleccionada.nombre" class="w-full h-full object-cover" />
            <v-icon v-else icon="mdi-domain" size="40" class="text-[#818cf8]"></v-icon>
          </div>
        </div>
        
        <div class="pt-14 px-8 pb-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-headline font-bold text-white">{{ empresaSeleccionada.nombre }}</h2>
              <div class="flex gap-3 mt-2">
                <span class="inline-flex items-center gap-1 text-xs font-bold bg-[#818cf8]/20 text-[#818cf8] px-2.5 py-1 rounded-md border border-[#818cf8]/30">
                  <v-icon icon="mdi-tag-outline" size="14"></v-icon> {{ empresaSeleccionada.rubro }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="space-y-6 text-gray-300 font-body">
            <div>
              <h3 class="text-sm font-bold text-white mb-2">Sobre la Empresa</h3>
              <p class="text-sm leading-relaxed">{{ empresaSeleccionada.descripcion || 'Esta empresa aliada ofrece excelentes oportunidades de pasantía para estudiantes de la UMSA, contribuyendo al desarrollo profesional del talento local.' }}</p>
            </div>
            
            <!-- Galería de Fotos -->
            <div v-if="empresaSeleccionada.galeria && empresaSeleccionada.galeria.length > 0">
              <h3 class="text-sm font-bold text-white mb-3">Galería Fotográfica</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div v-for="(img, idx) in empresaSeleccionada.galeria" :key="idx" class="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  <img :src="img.url" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </div>
            <div v-else class="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <v-icon icon="mdi-image-off-outline" size="32" class="text-gray-500 mb-2"></v-icon>
              <p class="text-xs font-medium text-gray-400">Esta empresa aún no ha subido fotografías a su galería.</p>
            </div>
          </div>
          
          <div class="mt-8 pt-6 border-t border-white/10 flex justify-end">
            <router-link to="/auth/registro-estudiante" class="bg-gradient-to-r from-[#818cf8] to-[#c084fc] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-all shadow-lg inline-flex items-center gap-2">
              Ver pasantías de esta empresa
              <v-icon icon="mdi-arrow-right" size="16"></v-icon>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const info = ref(null)
const empresas = ref([])
const empresaSeleccionada = ref(null)

const abrirModal = (empresa) => {
  empresaSeleccionada.value = empresa
  document.body.style.overflow = 'hidden' // Bloquear scroll
}

const cerrarModal = () => {
  empresaSeleccionada.value = null
  document.body.style.overflow = '' // Restaurar scroll
}

const menuItems = [
  { label: 'Misión', href: '#mision' },
  { label: 'Visión', href: '#vision' },
  { label: 'Objetivos', href: '#objetivos' },
  { label: 'Quiénes Somos', href: '#quienes-somos' }
]

const fetchData = async () => {
  try {
    // Fetch institucional info
    const infoRes = await axios.get('/api/informacion-empresa')
    if (infoRes.data && infoRes.data.length > 0) {
      info.value = infoRes.data[0] // Tomamos el primer registro
    }

    // Fetch empresas
    const empresasRes = await axios.get('/api/empresas')
    empresas.value = empresasRes.data.slice(0, 10) // Mostramos las primeras 10
  } catch (error) {
    console.error('Error fetching data:', error)
    // Cargar datos MOCK si no hay backend
    empresas.value = [
      { id_empresa: 1, nombre: 'TechNova Solutions', rubro: 'Tecnología', descripcion: 'Líderes en desarrollo de software corporativo con operaciones en toda la región andina. Buscamos talento joven para proyectos de innovación.', galeria: [{url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400&h=300'}, {url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400&h=300'}] },
      { id_empresa: 2, nombre: 'Banco Nacional', rubro: 'Banca y Finanzas', descripcion: 'Institución financiera comprometida con el desarrollo social y económico del país. Ofrecemos oportunidades de pasantía en áreas financieras y tecnológicas.', galeria: [] },
      { id_empresa: 3, nombre: 'Innovate SRL', rubro: 'Telecomunicaciones', descripcion: 'Empresa nacional de telecomunicaciones con amplio alcance.', galeria: [{url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=400&h=300'}] },
      { id_empresa: 4, nombre: 'Constructora Alfa', rubro: 'Construcción', descripcion: 'Liderando los proyectos de infraestructura más importantes de la ciudad.', galeria: [] }
    ]
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Animación para el Modal */
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
