export interface McqOption {
  id: string
  text: string
}

export interface McqItem {
  id: string
  question: string
  options: McqOption[]
  correctOptionId: string
  explanation: string
  topic: string
}

export const rickMortyProjectSummary = [
  'Proyecto: dashboard con tabs Characters/Locations usando la API de Rick & Morty.',
  'Stack solicitado: Next.js pages router, TypeScript, styled-components, Axios y React Query v5.',
  'Requisito clave: evitar refetch innecesario al cambiar tabs.',
  'Supuesto principal: primera pestaña toma /character y segunda /location.',
  'Sin paginacion/filtros/auth; UI simple para priorizar arquitectura y estado de datos.',
]

export const rickMortyInterviewQuestions = [
  'Por que elegiste staleTime infinito y que tradeoffs tiene?',
  'Como resolverias SSR + styled-components en pages router?',
  'Que diferencia hay entre mantener tabs montados vs lazy mount?',
  'Como agregarias paginacion sin romper cache ni UX?',
  'Que estrategia usarias para retries y manejo de errores de API?',
  'Si la API cambia shape, donde encapsulas el mapper?',
  'Como testearias tabs y cache de React Query?',
  'Que metricas mirarias para evaluar performance real?',
  'Como evolucionarias el proyecto a App Router?',
  'Que mejoras haria falta para produccion (accesibilidad, observabilidad, seguridad)?',
]

export const rickMortyMcq: McqItem[] = [
  {
    id: 'rm-01',
    topic: 'React Query',
    question: 'Que configuracion ayuda directamente a no refetchear al cambiar tabs si los datos ya se cargaron?',
    options: [
      { id: 'a', text: 'retry: false' },
      { id: 'b', text: 'staleTime: Infinity' },
      { id: 'c', text: 'refetchInterval: 1000' },
      { id: 'd', text: 'enabled: false permanente' },
    ],
    correctOptionId: 'b',
    explanation:
      'staleTime: Infinity mantiene la data fresca indefinidamente para React Query, por lo que al volver a la pestaña no dispara un refetch automatico.',
  },
  {
    id: 'rm-02',
    topic: 'Arquitectura',
    question: 'En el challenge, que ventaja concreta tiene mantener ambas tabs montadas y ocultar la inactiva?',
    options: [
      { id: 'a', text: 'Disminuye bundle size inicial' },
      { id: 'b', text: 'Elimina por completo las requests de red' },
      { id: 'c', text: 'Cambio instantaneo entre tabs y preserva estado local' },
      { id: 'd', text: 'Evita necesitar QueryClient' },
    ],
    correctOptionId: 'c',
    explanation:
      'Mantener montadas las vistas evita remount en cada switch y conserva estado local/UI, mejorando la fluidez del cambio de pestaña.',
  },
  {
    id: 'rm-03',
    topic: 'API',
    question: 'Que endpoint corresponde a personajes segun la documentacion de Rick & Morty?',
    options: [
      { id: 'a', text: '/api/location' },
      { id: 'b', text: '/api/species' },
      { id: 'c', text: '/api/character' },
      { id: 'd', text: '/api/person' },
    ],
    correctOptionId: 'c',
    explanation: 'El endpoint oficial para personajes es /api/character.',
  },
  {
    id: 'rm-04',
    topic: 'TypeScript',
    question: 'Para evitar errores en tarjetas de personajes, que conviene tipar primero?',
    options: [
      { id: 'a', text: 'Solo el estado del tab activo' },
      { id: 'b', text: 'El objeto completo de respuesta de API y sus items' },
      { id: 'c', text: 'Solo los estilos de styled-components' },
      { id: 'd', text: 'Ningun tipo, usar any para iterar rapido' },
    ],
    correctOptionId: 'b',
    explanation:
      'Tipar respuesta + entidades reduce bugs de acceso a propiedades y facilita mapeos de UI con autocompletado confiable.',
  },
  {
    id: 'rm-05',
    topic: 'Styled-components',
    question: 'En pages router, para SSR correcto con styled-components, donde suele hacerse la integracion?',
    options: [
      { id: 'a', text: 'En _document.tsx' },
      { id: 'b', text: 'En next.config.js solamente' },
      { id: 'c', text: 'Solo en componentes individuales' },
      { id: 'd', text: 'No requiere configuracion SSR' },
    ],
    correctOptionId: 'a',
    explanation:
      'En pages router, _document.tsx es el punto comun para colectar/inyectar estilos del server y evitar flicker/hydration mismatch.',
  },
  {
    id: 'rm-06',
    topic: 'Axios',
    question: 'Cual es una mejora simple para no repetir base URL en cada request?',
    options: [
      { id: 'a', text: 'Crear instancia de axios con baseURL' },
      { id: 'b', text: 'Usar fetch en paralelo con axios' },
      { id: 'c', text: 'Guardar URL en localStorage' },
      { id: 'd', text: 'Hardcodear en cada componente' },
    ],
    correctOptionId: 'a',
    explanation: 'Una instancia centralizada de axios mejora mantenibilidad y facilita agregar interceptors/timeouts.',
  },
  {
    id: 'rm-07',
    topic: 'React Query',
    question: 'Que queryKey es mejor para la tab Characters?',
    options: [
      { id: 'a', text: "['characters']" },
      { id: 'b', text: "['data']" },
      { id: 'c', text: "['tab']" },
      { id: 'd', text: "['items', Math.random()]" },
    ],
    correctOptionId: 'a',
    explanation: 'Una key semantica y estable como ["characters"] permite cache correcto e invalidez controlada.',
  },
  {
    id: 'rm-08',
    topic: 'UX',
    question: 'Si queres lazy load por tab y mantener buena UX, que estrategia es mejor?',
    options: [
      { id: 'a', text: 'Deshabilitar cache y recargar siempre' },
      { id: 'b', text: 'Prefetch de la tab no activa al hover/foco' },
      { id: 'c', text: 'No mostrar loading nunca' },
      { id: 'd', text: 'Fetch en useEffect sin query key' },
    ],
    correctOptionId: 'b',
    explanation: 'Prefetch reduce latencia percibida sin pagar costo completo de montar todo desde el inicio.',
  },
  {
    id: 'rm-09',
    topic: 'Errores',
    question: 'Que deberia mostrar cada tab cuando falla la API?',
    options: [
      { id: 'a', text: 'Pantalla en blanco' },
      { id: 'b', text: 'Solo console.log' },
      { id: 'c', text: 'Estado de error visible + opcion de retry' },
      { id: 'd', text: 'Recargar pagina automaticamente sin limite' },
    ],
    correctOptionId: 'c',
    explanation: 'Un estado de error visible y accionable mejora DX/UX y facilita depuracion.',
  },
  {
    id: 'rm-10',
    topic: 'Tradeoffs',
    question: 'Que desventaja puede tener staleTime: Infinity en produccion?',
    options: [
      { id: 'a', text: 'Los datos pueden quedar viejos si backend cambia' },
      { id: 'b', text: 'No funciona con TypeScript' },
      { id: 'c', text: 'Rompe axios' },
      { id: 'd', text: 'Impide renderizar listas' },
    ],
    correctOptionId: 'a',
    explanation: 'Sin invalidacion/policing, la data queda potencialmente stale por tiempo indeterminado.',
  },
  {
    id: 'rm-11',
    topic: 'Testing',
    question: 'Que validarias primero en tests de este challenge?',
    options: [
      { id: 'a', text: 'Color exacto de cada card' },
      { id: 'b', text: 'Cambio de tab sin refetch innecesario' },
      { id: 'c', text: 'Orden alfabetico de commits' },
      { id: 'd', text: 'Tamaño de fuente del README' },
    ],
    correctOptionId: 'b',
    explanation: 'Es el requisito funcional mas critico del ejercicio, junto con render de data por tab.',
  },
  {
    id: 'rm-12',
    topic: 'Accessibility',
    question: 'Para tabs accesibles, que atributo es clave en el trigger activo?',
    options: [
      { id: 'a', text: 'aria-selected="true"' },
      { id: 'b', text: 'aria-hidden="true"' },
      { id: 'c', text: 'role="alert"' },
      { id: 'd', text: 'tabindex="-2"' },
    ],
    correctOptionId: 'a',
    explanation: 'aria-selected comunica a tecnologias asistivas cual tab esta activa.',
  },
]

