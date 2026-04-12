export const defaultNS = 'common';
export const fallbackLng = 'pt';

export const resources = {
  pt: {
    common: {
      logo: {
        title: 'Page Form',
      },
      language: {
        label: 'Idioma',
        portuguese: 'Português',
        english: 'Inglês',
        spanish: 'Espanhol',
      },
      theme: {
        light: 'Claro',
        dark: 'Escuro',
        system: 'Sistema',
      },
      createForm: {
        cardCta: 'Criar novo formulário',
        dialogTitle: 'Criar novo formulário',
        dialogDescription:
          'Crie um novo formulário para começar a coletar respostas.',
        name: 'Nome',
        description: 'Descrição',
        descriptionPlaceholder: 'Descrição do formulário',
        submit: 'Criar formulário',
        creating: 'Criando...',
        successTitle: 'Formulário criado com sucesso!',
        successDescription:
          'Seu formulário foi criado e está pronto para uso. ID: {{id}}',
        errorTitle: 'Falha ao criar formulário. Tente novamente.',
        errorDescription: 'Ocorreu um erro inesperado.',
      },
      visit: {
        cta: 'Visitar',
      },
      dashboard: {
        yourForms: 'Seus formulários',
        totalVisits: 'Total de visitas',
        totalSubmissions: 'Total de envios',
        submissionRate: 'Taxa de envio',
        bounceRate: 'Taxa de rejeição',
        allTimeFormVisits: 'Visitas totais do formulário',
        allTimeFormSubmissions: 'Envios totais do formulário',
        visitorsSubmitted: 'Visitantes que enviaram o formulário',
        visitorsLeft: 'Visitantes que saíram sem interagir',
        published: 'Publicado',
        draft: 'Rascunho',
        noDescription: 'Sem descrição fornecida',
        viewSubmissions: 'Ver envios',
        editForm: 'Editar formulário',
      },
      formDetails: {
        submissions: 'Envios',
        submittedAt: 'Enviado em',
        noSubmissions: 'Nenhum envio encontrado para este formulário.',
      },
      formBuilder: {
        publishedTitle: 'Formulário publicado',
        shareThisForm: 'Compartilhe este formulário',
        shareDescription:
          'Qualquer pessoa com o link pode visualizar e enviar o formulário',
        copyLink: 'Copiar link',
        linkCopied: 'Link copiado para a área de transferência!',
        backToDashboard: 'Voltar ao dashboard',
        formDetails: 'Detalhes do formulário',
        formLabel: 'Formulário:',
      },
      preview: {
        title: 'Pré-visualizar',
        headerTitle: 'Pré-visualização do formulário',
        headerDescription:
          'Esta é uma pré-visualização do formulário. Você pode interagir, mas nenhum dado será salvo.',
      },
      publish: {
        button: 'Publicar formulário',
        confirmTitle: 'Tem certeza?',
        confirmDescription: 'Tem certeza que deseja publicar este formulário?',
        confirmWarning:
          'Depois de publicado, os usuários poderão preencher o formulário.',
        cancel: 'Cancelar',
        confirm: 'Publicar',
        success: 'Formulário publicado com sucesso!',
        error: 'Falha ao publicar formulário. Tente novamente mais tarde.',
      },
      save: {
        button: 'Salvar formulário',
        success: 'Formulário salvo com sucesso',
        savedDescription: 'Seu formulário foi salvo.',
        error: 'Falha ao salvar formulário.',
      },
      generic: {
        unexpectedError: 'Ocorreu um erro inesperado.',
      },
      share: {
        button: 'Compartilhar link',
        copiedTitle: 'Copiado',
        copiedDescription: 'Link copiado para a área de transferência!',
      },
      sidebar: {
        formElements: 'Elementos do formulário',
        layoutElements: 'Elementos de layout',
        inputElements: 'Elementos de entrada',
        elementProperties: 'Propriedades do elemento',
      },
      fields: {
        textField: 'Campo de texto',
        titleField: 'Título',
        subtitleField: 'Subtítulo',
        paragraphField: 'Parágrafo',
        separatorField: 'Separador',
        spacerField: 'Espaçador',
      },
    },
  },
  en: {
    common: {
      logo: {
        title: 'Page Form',
      },
      language: {
        label: 'Language',
        portuguese: 'Portuguese',
        english: 'English',
        spanish: 'Spanish',
      },
      theme: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
      createForm: {
        cardCta: 'Create new form',
        dialogTitle: 'Create a new form',
        dialogDescription: 'Create a new form to start collecting responses.',
        name: 'Name',
        description: 'Description',
        descriptionPlaceholder: 'Form description',
        submit: 'Create form',
        creating: 'Creating...',
        successTitle: 'Form created successfully!',
        successDescription:
          'Your form has been created and is ready to use. ID: {{id}}',
        errorTitle: 'Failed to create form. Please try again.',
        errorDescription: 'An unexpected error occurred.',
      },
      visit: {
        cta: 'Visit',
      },
      dashboard: {
        yourForms: 'Your Forms',
        totalVisits: 'Total Visits',
        totalSubmissions: 'Total Submissions',
        submissionRate: 'Submission rate',
        bounceRate: 'Bounce rate',
        allTimeFormVisits: 'All time form visits',
        allTimeFormSubmissions: 'All time form submissions',
        visitorsSubmitted: 'Visitors that submitted the form',
        visitorsLeft: 'Visitors that leave without interaction',
        published: 'Published',
        draft: 'Draft',
        noDescription: 'No description provided',
        viewSubmissions: 'View submissions',
        editForm: 'Edit form',
      },
      formDetails: {
        submissions: 'Submissions',
        submittedAt: 'Submitted At',
        noSubmissions: 'No submissions found for this form.',
      },
      formBuilder: {
        publishedTitle: 'Form published',
        shareThisForm: 'Share this form',
        shareDescription: 'Anyone with the link can view and submit the form',
        copyLink: 'Copy Link',
        linkCopied: 'Link copied to clipboard!',
        backToDashboard: 'Back to Dashboard',
        formDetails: 'Form Details',
        formLabel: 'Form:',
      },
      preview: {
        title: 'Preview',
        headerTitle: 'Form Preview',
        headerDescription:
          'This is a preview of your form. You can interact with it, but no data will be saved.',
      },
      publish: {
        button: 'Publish form',
        confirmTitle: 'Are you sure?',
        confirmDescription: 'Are you sure you want to publish this form?',
        confirmWarning:
          'Once published, users will be able to fill out this form.',
        cancel: 'Cancel',
        confirm: 'Publish',
        success: 'Form published successfully!',
        error: 'Failed to publish form. Please try again later.',
      },
      save: {
        button: 'Save form',
        success: 'Form saved successfully',
        savedDescription: 'Your form has been saved.',
        error: 'Failed to save form',
      },
      generic: {
        unexpectedError: 'An unexpected error occurred.',
      },
      share: {
        button: 'Share Link',
        copiedTitle: 'Copied',
        copiedDescription: 'Link copied to clipboard!',
      },
      sidebar: {
        formElements: 'Form Elements',
        layoutElements: 'Layout elements',
        inputElements: 'Form elements',
        elementProperties: 'Element Properties',
      },
      fields: {
        textField: 'Text Field',
        titleField: 'Title Field',
        subtitleField: 'Subtitle Field',
        paragraphField: 'Paragraph Field',
        separatorField: 'Separator Field',
        spacerField: 'Spacer Field',
      },
    },
  },
  es: {
    common: {
      logo: {
        title: 'Page Form',
      },
      language: {
        label: 'Idioma',
        portuguese: 'Portugues',
        english: 'Ingles',
        spanish: 'Espanol',
      },
      theme: {
        light: 'Claro',
        dark: 'Oscuro',
        system: 'Sistema',
      },
      createForm: {
        cardCta: 'Crear nuevo formulario',
        dialogTitle: 'Crear nuevo formulario',
        dialogDescription:
          'Crea un nuevo formulario para comenzar a recopilar respuestas.',
        name: 'Nombre',
        description: 'Descripcion',
        descriptionPlaceholder: 'Descripcion del formulario',
        submit: 'Crear formulario',
        creating: 'Creando...',
        successTitle: 'Formulario creado con exito!',
        successDescription:
          'Tu formulario fue creado y esta listo para usar. ID: {{id}}',
        errorTitle: 'No se pudo crear el formulario. Intentalo de nuevo.',
        errorDescription: 'Ocurrio un error inesperado.',
      },
      visit: {
        cta: 'Visitar',
      },
      dashboard: {
        yourForms: 'Tus formularios',
        totalVisits: 'Visitas totales',
        totalSubmissions: 'Envios totales',
        submissionRate: 'Tasa de envio',
        bounceRate: 'Tasa de rebote',
        allTimeFormVisits: 'Visitas historicas del formulario',
        allTimeFormSubmissions: 'Envios historicos del formulario',
        visitorsSubmitted: 'Visitantes que enviaron el formulario',
        visitorsLeft: 'Visitantes que se fueron sin interactuar',
        published: 'Publicado',
        draft: 'Borrador',
        noDescription: 'Sin descripcion',
        viewSubmissions: 'Ver envios',
        editForm: 'Editar formulario',
      },
      formDetails: {
        submissions: 'Envios',
        submittedAt: 'Enviado el',
        noSubmissions: 'No se encontraron envios para este formulario.',
      },
      formBuilder: {
        publishedTitle: 'Formulario publicado',
        shareThisForm: 'Comparte este formulario',
        shareDescription:
          'Cualquiera con el enlace puede ver y enviar el formulario',
        copyLink: 'Copiar enlace',
        linkCopied: 'Enlace copiado al portapapeles!',
        backToDashboard: 'Volver al panel',
        formDetails: 'Detalles del formulario',
        formLabel: 'Formulario:',
      },
      preview: {
        title: 'Vista previa',
        headerTitle: 'Vista previa del formulario',
        headerDescription:
          'Esta es una vista previa de tu formulario. Puedes interactuar con el, pero no se guardara ningun dato.',
      },
      publish: {
        button: 'Publicar formulario',
        confirmTitle: 'Estas seguro?',
        confirmDescription:
          'Estas seguro de que quieres publicar este formulario?',
        confirmWarning:
          'Una vez publicado, los usuarios podran completar este formulario.',
        cancel: 'Cancelar',
        confirm: 'Publicar',
        success: 'Formulario publicado con exito!',
        error:
          'No se pudo publicar el formulario. Intentalo de nuevo mas tarde.',
      },
      save: {
        button: 'Guardar formulario',
        success: 'Formulario guardado con exito',
        savedDescription: 'Tu formulario fue guardado.',
        error: 'No se pudo guardar el formulario',
      },
      generic: {
        unexpectedError: 'Ocurrio un error inesperado.',
      },
      share: {
        button: 'Compartir enlace',
        copiedTitle: 'Copiado',
        copiedDescription: 'Enlace copiado al portapapeles!',
      },
      sidebar: {
        formElements: 'Elementos del formulario',
        layoutElements: 'Elementos de layout',
        inputElements: 'Elementos de formulario',
        elementProperties: 'Propiedades del elemento',
      },
      fields: {
        textField: 'Campo de texto',
        titleField: 'Titulo',
        subtitleField: 'Subtitulo',
        paragraphField: 'Parrafo',
        separatorField: 'Separador',
        spacerField: 'Espaciador',
      },
    },
  },
} as const;

export type AppLanguages = keyof typeof resources;
