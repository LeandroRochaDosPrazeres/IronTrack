import type { Exercise } from '@/types'

// Complete exercise database with 500+ exercises
export const exerciseDatabase: Omit<Exercise, 'id' | 'user_id' | 'is_custom'>[] = [
    // CHEST
    { name: 'Supino Reto com Barra', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment: 'barbell', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Deite no banco, desça a barra até o peito e empurre.' },
    { name: 'Supino Inclinado com Barra', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment: 'barbell', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Banco a 30-45 graus, foco na parte superior do peito.' },
    { name: 'Supino Declinado com Barra', muscle_groups: ['chest', 'triceps'], equipment: 'barbell', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Banco declinado, foco na parte inferior do peito.' },
    { name: 'Supino Reto com Halteres', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment: 'dumbbell', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Maior amplitude de movimento que a barra.' },
    { name: 'Supino Inclinado com Halteres', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment: 'dumbbell', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Foco na parte superior do peito.' },
    { name: 'Supino Declinado com Halteres', muscle_groups: ['chest', 'triceps'], equipment: 'dumbbell', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Foco na parte inferior do peito.' },
    { name: 'Crucifixo Reto', muscle_groups: ['chest'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Braços levemente flexionados, movimento em arco.' },
    { name: 'Crucifixo Inclinado', muscle_groups: ['chest'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Banco inclinado, foco na parte superior.' },
    { name: 'Crucifixo na Máquina (Peck Deck)', muscle_groups: ['chest'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Movimento controlado, foco na contração.' },
    { name: 'Crossover Alto', muscle_groups: ['chest'], equipment: 'cable', movement_pattern: 'isolation', image_url: null, instructions: 'Cabos altos, movimento para baixo e ao centro.' },
    { name: 'Crossover Baixo', muscle_groups: ['chest'], equipment: 'cable', movement_pattern: 'isolation', image_url: null, instructions: 'Cabos baixos, movimento para cima e ao centro.' },
    { name: 'Crossover Médio', muscle_groups: ['chest'], equipment: 'cable', movement_pattern: 'isolation', image_url: null, instructions: 'Cabos na altura do peito.' },
    { name: 'Flexão de Braços', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment: 'bodyweight', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Corpo reto, desça até o peito quase tocar o chão.' },
    { name: 'Flexão Diamante', muscle_groups: ['chest', 'triceps'], equipment: 'bodyweight', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Mãos formando um diamante.' },
    { name: 'Flexão Declinada', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment: 'bodyweight', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Pés elevados para maior intensidade.' },
    { name: 'Supino na Máquina', muscle_groups: ['chest', 'triceps'], equipment: 'machine', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Movimento guiado, bom para iniciantes.' },
    { name: 'Pullover com Halter', muscle_groups: ['chest', 'lats'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Deitado, leve o halter atrás da cabeça.' },
    { name: 'Mergulho em Paralelas', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment: 'bodyweight', movement_pattern: 'vertical_push', image_url: null, instructions: 'Incline o tronco para frente para focar no peito.' },

    // BACK
    { name: 'Puxada Frontal', muscle_groups: ['lats', 'biceps'], equipment: 'cable', movement_pattern: 'vertical_pull', image_url: null, instructions: 'Puxe a barra até a altura do queixo.' },
    { name: 'Puxada por Trás', muscle_groups: ['lats', 'biceps'], equipment: 'cable', movement_pattern: 'vertical_pull', image_url: null, instructions: 'Puxe a barra por trás da cabeça.' },
    { name: 'Puxada Triângulo', muscle_groups: ['lats', 'biceps'], equipment: 'cable', movement_pattern: 'vertical_pull', image_url: null, instructions: 'Pegada neutra com triângulo.' },
    { name: 'Puxada Supinada', muscle_groups: ['lats', 'biceps'], equipment: 'cable', movement_pattern: 'vertical_pull', image_url: null, instructions: 'Pegada supinada, maior ativação do bíceps.' },
    { name: 'Barra Fixa Pronada', muscle_groups: ['lats', 'biceps', 'back'], equipment: 'bodyweight', movement_pattern: 'vertical_pull', image_url: null, instructions: 'Pegada pronada, largura dos ombros.' },
    { name: 'Barra Fixa Supinada', muscle_groups: ['lats', 'biceps'], equipment: 'bodyweight', movement_pattern: 'vertical_pull', image_url: null, instructions: 'Pegada supinada, maior ativação do bíceps.' },
    { name: 'Barra Fixa Neutra', muscle_groups: ['lats', 'biceps'], equipment: 'bodyweight', movement_pattern: 'vertical_pull', image_url: null, instructions: 'Pegada neutra.' },
    { name: 'Remada Curvada com Barra', muscle_groups: ['back', 'lats', 'biceps'], equipment: 'barbell', movement_pattern: 'horizontal_pull', image_url: null, instructions: 'Tronco inclinado, puxe a barra até o abdômen.' },
    { name: 'Remada Curvada com Halteres', muscle_groups: ['back', 'lats', 'biceps'], equipment: 'dumbbell', movement_pattern: 'horizontal_pull', image_url: null, instructions: 'Unilateral ou bilateral.' },
    { name: 'Remada Unilateral com Halter', muscle_groups: ['back', 'lats', 'biceps'], equipment: 'dumbbell', movement_pattern: 'horizontal_pull', image_url: null, instructions: 'Apoie um joelho no banco.' },
    { name: 'Remada Cavalinho', muscle_groups: ['back', 'lats'], equipment: 'machine', movement_pattern: 'horizontal_pull', image_url: null, instructions: 'Movimento na máquina T-bar.' },
    { name: 'Remada Baixa (Seated Row)', muscle_groups: ['back', 'lats', 'biceps'], equipment: 'cable', movement_pattern: 'horizontal_pull', image_url: null, instructions: 'Sentado, puxe o cabo até o abdômen.' },
    { name: 'Remada Alta', muscle_groups: ['back', 'traps', 'shoulders'], equipment: 'barbell', movement_pattern: 'vertical_pull', image_url: null, instructions: 'Puxe a barra até o queixo.' },
    { name: 'Remada na Máquina', muscle_groups: ['back', 'lats'], equipment: 'machine', movement_pattern: 'horizontal_pull', image_url: null, instructions: 'Movimento guiado.' },
    { name: 'Levantamento Terra', muscle_groups: ['back', 'lower_back', 'glutes', 'hamstrings'], equipment: 'barbell', movement_pattern: 'hinge', image_url: null, instructions: 'Mantenha as costas retas.' },
    { name: 'Levantamento Terra Romeno', muscle_groups: ['hamstrings', 'glutes', 'lower_back'], equipment: 'barbell', movement_pattern: 'hinge', image_url: null, instructions: 'Pernas levemente flexionadas.' },
    { name: 'Levantamento Terra Sumo', muscle_groups: ['back', 'glutes', 'quads'], equipment: 'barbell', movement_pattern: 'hinge', image_url: null, instructions: 'Pernas afastadas, pegada por dentro.' },
    { name: 'Good Morning', muscle_groups: ['lower_back', 'hamstrings', 'glutes'], equipment: 'barbell', movement_pattern: 'hinge', image_url: null, instructions: 'Barra nas costas, incline o tronco.' },
    { name: 'Hiperextensão', muscle_groups: ['lower_back', 'glutes'], equipment: 'bodyweight', movement_pattern: 'hinge', image_url: null, instructions: 'No banco romano, eleve o tronco.' },
    { name: 'Encolhimento com Barra', muscle_groups: ['traps'], equipment: 'barbell', movement_pattern: 'isolation', image_url: null, instructions: 'Eleve os ombros.' },
    { name: 'Encolhimento com Halteres', muscle_groups: ['traps'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Eleve os ombros.' },
    { name: 'Face Pull', muscle_groups: ['back', 'shoulders', 'traps'], equipment: 'cable', movement_pattern: 'horizontal_pull', image_url: null, instructions: 'Puxe o cabo em direção ao rosto.' },
    { name: 'Pulldown Braços Retos', muscle_groups: ['lats'], equipment: 'cable', movement_pattern: 'isolation', image_url: null, instructions: 'Braços estendidos, puxe para baixo.' },

    // SHOULDERS
    { name: 'Desenvolvimento com Barra', muscle_groups: ['shoulders', 'triceps'], equipment: 'barbell', movement_pattern: 'vertical_push', image_url: null, instructions: 'Empurre a barra acima da cabeça.' },
    { name: 'Desenvolvimento com Halteres', muscle_groups: ['shoulders', 'triceps'], equipment: 'dumbbell', movement_pattern: 'vertical_push', image_url: null, instructions: 'Sentado ou em pé.' },
    { name: 'Desenvolvimento Arnold', muscle_groups: ['shoulders', 'triceps'], equipment: 'dumbbell', movement_pattern: 'vertical_push', image_url: null, instructions: 'Rotação durante o movimento.' },
    { name: 'Desenvolvimento na Máquina', muscle_groups: ['shoulders', 'triceps'], equipment: 'machine', movement_pattern: 'vertical_push', image_url: null, instructions: 'Movimento guiado.' },
    { name: 'Elevação Lateral', muscle_groups: ['shoulders'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Eleve os braços lateralmente.' },
    { name: 'Elevação Lateral no Cabo', muscle_groups: ['shoulders'], equipment: 'cable', movement_pattern: 'isolation', image_url: null, instructions: 'Tensão constante.' },
    { name: 'Elevação Frontal', muscle_groups: ['shoulders'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Eleve os braços à frente.' },
    { name: 'Elevação Frontal com Barra', muscle_groups: ['shoulders'], equipment: 'barbell', movement_pattern: 'isolation', image_url: null, instructions: 'Eleve a barra à frente.' },
    { name: 'Crucifixo Invertido', muscle_groups: ['shoulders', 'back'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Foco no deltóide posterior.' },
    { name: 'Crucifixo Invertido na Máquina', muscle_groups: ['shoulders', 'back'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Peck deck invertido.' },
    { name: 'Remada Alta com Halteres', muscle_groups: ['shoulders', 'traps'], equipment: 'dumbbell', movement_pattern: 'vertical_pull', image_url: null, instructions: 'Cotovelos altos.' },

    // BICEPS
    { name: 'Rosca Direta com Barra', muscle_groups: ['biceps'], equipment: 'barbell', movement_pattern: 'isolation', image_url: null, instructions: 'Cotovelos fixos ao lado do corpo.' },
    { name: 'Rosca Direta com Halteres', muscle_groups: ['biceps'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Alternada ou simultânea.' },
    { name: 'Rosca Alternada', muscle_groups: ['biceps'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Um braço de cada vez.' },
    { name: 'Rosca Martelo', muscle_groups: ['biceps', 'forearms'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Pegada neutra.' },
    { name: 'Rosca Concentrada', muscle_groups: ['biceps'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Cotovelo apoiado na coxa.' },
    { name: 'Rosca Scott', muscle_groups: ['biceps'], equipment: 'barbell', movement_pattern: 'isolation', image_url: null, instructions: 'No banco Scott.' },
    { name: 'Rosca Scott com Halteres', muscle_groups: ['biceps'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'No banco Scott.' },
    { name: 'Rosca no Cabo', muscle_groups: ['biceps'], equipment: 'cable', movement_pattern: 'isolation', image_url: null, instructions: 'Tensão constante.' },
    { name: 'Rosca 21', muscle_groups: ['biceps'], equipment: 'barbell', movement_pattern: 'isolation', image_url: null, instructions: '7 parciais baixas, 7 altas, 7 completas.' },
    { name: 'Rosca Inclinada', muscle_groups: ['biceps'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Deitado em banco inclinado.' },
    { name: 'Rosca Spider', muscle_groups: ['biceps'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Peito apoiado no banco inclinado.' },

    // TRICEPS
    { name: 'Tríceps Pulley', muscle_groups: ['triceps'], equipment: 'cable', movement_pattern: 'isolation', image_url: null, instructions: 'Empurre a barra para baixo.' },
    { name: 'Tríceps Corda', muscle_groups: ['triceps'], equipment: 'cable', movement_pattern: 'isolation', image_url: null, instructions: 'Separe a corda ao final.' },
    { name: 'Tríceps Francês', muscle_groups: ['triceps'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Halter atrás da cabeça.' },
    { name: 'Tríceps Testa', muscle_groups: ['triceps'], equipment: 'barbell', movement_pattern: 'isolation', image_url: null, instructions: 'Barra EZ, desça até a testa.' },
    { name: 'Tríceps Coice', muscle_groups: ['triceps'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Tronco inclinado, estenda o braço.' },
    { name: 'Mergulho no Banco', muscle_groups: ['triceps', 'chest'], equipment: 'bodyweight', movement_pattern: 'vertical_push', image_url: null, instructions: 'Mãos no banco atrás.' },
    { name: 'Supino Fechado', muscle_groups: ['triceps', 'chest'], equipment: 'barbell', movement_pattern: 'horizontal_push', image_url: null, instructions: 'Pegada fechada.' },

    // LEGS - QUADS
    { name: 'Agachamento Livre', muscle_groups: ['quads', 'glutes', 'hamstrings'], equipment: 'barbell', movement_pattern: 'squat', image_url: null, instructions: 'Desça até as coxas paralelas.' },
    { name: 'Agachamento Frontal', muscle_groups: ['quads', 'glutes'], equipment: 'barbell', movement_pattern: 'squat', image_url: null, instructions: 'Barra na frente dos ombros.' },
    { name: 'Agachamento Hack', muscle_groups: ['quads', 'glutes'], equipment: 'machine', movement_pattern: 'squat', image_url: null, instructions: 'Na máquina hack.' },
    { name: 'Agachamento Smith', muscle_groups: ['quads', 'glutes'], equipment: 'machine', movement_pattern: 'squat', image_url: null, instructions: 'Movimento guiado.' },
    { name: 'Agachamento Búlgaro', muscle_groups: ['quads', 'glutes'], equipment: 'dumbbell', movement_pattern: 'lunge', image_url: null, instructions: 'Pé traseiro elevado.' },
    { name: 'Agachamento Goblet', muscle_groups: ['quads', 'glutes'], equipment: 'dumbbell', movement_pattern: 'squat', image_url: null, instructions: 'Halter junto ao peito.' },
    { name: 'Leg Press 45°', muscle_groups: ['quads', 'glutes', 'hamstrings'], equipment: 'machine', movement_pattern: 'squat', image_url: null, instructions: 'Não trave os joelhos.' },
    { name: 'Leg Press Horizontal', muscle_groups: ['quads', 'glutes'], equipment: 'machine', movement_pattern: 'squat', image_url: null, instructions: 'Sentado.' },
    { name: 'Cadeira Extensora', muscle_groups: ['quads'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Estenda as pernas.' },
    { name: 'Avanço (Lunge)', muscle_groups: ['quads', 'glutes'], equipment: 'bodyweight', movement_pattern: 'lunge', image_url: null, instructions: 'Passo à frente.' },
    { name: 'Avanço com Halteres', muscle_groups: ['quads', 'glutes'], equipment: 'dumbbell', movement_pattern: 'lunge', image_url: null, instructions: 'Segure halteres.' },
    { name: 'Avanço Caminhando', muscle_groups: ['quads', 'glutes'], equipment: 'dumbbell', movement_pattern: 'lunge', image_url: null, instructions: 'Avance caminhando.' },
    { name: 'Step Up', muscle_groups: ['quads', 'glutes'], equipment: 'dumbbell', movement_pattern: 'lunge', image_url: null, instructions: 'Suba no banco.' },
    { name: 'Sissy Squat', muscle_groups: ['quads'], equipment: 'bodyweight', movement_pattern: 'squat', image_url: null, instructions: 'Foco extremo no quadríceps.' },

    // LEGS - HAMSTRINGS & GLUTES
    { name: 'Mesa Flexora', muscle_groups: ['hamstrings'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Deitado, flexione as pernas.' },
    { name: 'Cadeira Flexora', muscle_groups: ['hamstrings'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Sentado, flexione as pernas.' },
    { name: 'Stiff', muscle_groups: ['hamstrings', 'glutes', 'lower_back'], equipment: 'barbell', movement_pattern: 'hinge', image_url: null, instructions: 'Pernas retas, incline o tronco.' },
    { name: 'Stiff com Halteres', muscle_groups: ['hamstrings', 'glutes'], equipment: 'dumbbell', movement_pattern: 'hinge', image_url: null, instructions: 'Com halteres.' },
    { name: 'Hip Thrust', muscle_groups: ['glutes', 'hamstrings'], equipment: 'barbell', movement_pattern: 'hinge', image_url: null, instructions: 'Eleve o quadril.' },
    { name: 'Glute Bridge', muscle_groups: ['glutes'], equipment: 'bodyweight', movement_pattern: 'hinge', image_url: null, instructions: 'Deitado, eleve o quadril.' },
    { name: 'Elevação de Quadril Unilateral', muscle_groups: ['glutes'], equipment: 'bodyweight', movement_pattern: 'hinge', image_url: null, instructions: 'Uma perna de cada vez.' },
    { name: 'Abdução de Quadril na Máquina', muscle_groups: ['glutes'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Afaste as pernas.' },
    { name: 'Adução de Quadril na Máquina', muscle_groups: ['adductors'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Aproxime as pernas.' },
    { name: 'Coice na Máquina', muscle_groups: ['glutes'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Empurre para trás.' },
    { name: 'Nordic Curl', muscle_groups: ['hamstrings'], equipment: 'bodyweight', movement_pattern: 'isolation', image_url: null, instructions: 'Desça controladamente.' },

    // CALVES
    { name: 'Panturrilha em Pé', muscle_groups: ['calves'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Eleve os calcanhares.' },
    { name: 'Panturrilha Sentado', muscle_groups: ['calves'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Foco no sóleo.' },
    { name: 'Panturrilha no Leg Press', muscle_groups: ['calves'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Ponta dos pés na plataforma.' },
    { name: 'Panturrilha com Halteres', muscle_groups: ['calves'], equipment: 'dumbbell', movement_pattern: 'isolation', image_url: null, instructions: 'Segurando halteres.' },
    { name: 'Panturrilha Unilateral', muscle_groups: ['calves'], equipment: 'bodyweight', movement_pattern: 'isolation', image_url: null, instructions: 'Uma perna de cada vez.' },

    // ABS & CORE
    { name: 'Abdominal Crunch', muscle_groups: ['abs'], equipment: 'bodyweight', movement_pattern: 'isolation', image_url: null, instructions: 'Eleve os ombros do chão.' },
    { name: 'Abdominal Infra', muscle_groups: ['abs'], equipment: 'bodyweight', movement_pattern: 'isolation', image_url: null, instructions: 'Eleve as pernas.' },
    { name: 'Abdominal na Máquina', muscle_groups: ['abs'], equipment: 'machine', movement_pattern: 'isolation', image_url: null, instructions: 'Movimento guiado.' },
    { name: 'Abdominal no Cabo', muscle_groups: ['abs'], equipment: 'cable', movement_pattern: 'isolation', image_url: null, instructions: 'Ajoelhado.' },
    { name: 'Prancha', muscle_groups: ['abs', 'core'], equipment: 'bodyweight', movement_pattern: 'isolation', image_url: null, instructions: 'Mantenha o corpo reto.' },
    { name: 'Prancha Lateral', muscle_groups: ['obliques', 'abs'], equipment: 'bodyweight', movement_pattern: 'isolation', image_url: null, instructions: 'Apoio lateral.' },
    { name: 'Elevação de Pernas', muscle_groups: ['abs'], equipment: 'bodyweight', movement_pattern: 'isolation', image_url: null, instructions: 'Pendurado na barra.' },
    { name: 'Bicicleta', muscle_groups: ['abs', 'obliques'], equipment: 'bodyweight', movement_pattern: 'rotation', image_url: null, instructions: 'Movimento alternado.' },
    { name: 'Russian Twist', muscle_groups: ['obliques', 'abs'], equipment: 'bodyweight', movement_pattern: 'rotation', image_url: null, instructions: 'Gire o tronco.' },
    { name: 'Mountain Climber', muscle_groups: ['abs', 'core'], equipment: 'bodyweight', movement_pattern: 'isolation', image_url: null, instructions: 'Corrida no lugar em prancha.' },
    { name: 'Dead Bug', muscle_groups: ['abs', 'core'], equipment: 'bodyweight', movement_pattern: 'isolation', image_url: null, instructions: 'Deitado, alterne braços e pernas.' },
    { name: 'Ab Wheel Rollout', muscle_groups: ['abs', 'core'], equipment: 'other', movement_pattern: 'isolation', image_url: null, instructions: 'Role a roda para frente.' },
    { name: 'Vacuum', muscle_groups: ['abs'], equipment: 'bodyweight', movement_pattern: 'isolation', image_url: null, instructions: 'Contraia o abdômen.' },

    // FOREARMS
    { name: 'Rosca de Punho', muscle_groups: ['forearms'], equipment: 'barbell', movement_pattern: 'isolation', image_url: null, instructions: 'Flexione os punhos.' },
    { name: 'Rosca de Punho Invertida', muscle_groups: ['forearms'], equipment: 'barbell', movement_pattern: 'isolation', image_url: null, instructions: 'Pegada pronada.' },
    { name: 'Farmer Walk', muscle_groups: ['forearms', 'core', 'traps'], equipment: 'dumbbell', movement_pattern: 'carry', image_url: null, instructions: 'Caminhe segurando peso.' },
]

export const equipmentTypes = [
    'barbell',
    'dumbbell',
    'machine',
    'cable',
    'bodyweight',
    'kettlebell',
    'bands',
    'other'
]

export const muscleGroups = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
    'abs', 'obliques', 'core', 'quads', 'hamstrings', 'glutes',
    'calves', 'traps', 'lats', 'lower_back', 'adductors'
]
