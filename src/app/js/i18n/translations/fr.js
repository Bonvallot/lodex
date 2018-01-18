/* eslint max-len: off */
export default {
    Admin: 'Admin',
    'Sign in': 'Se connecter',
    parsing: 'Importé',
    parsing_summary: '%{count} ressources chargées',
    parsing_summary_columns: '%{count} colonnes chargées',
    publication_summary_columns: '%{count} colonnes ajoutées',
    'total lines': 'total lines',
    'successfully parsed': 'successfully parsed',
    'with errors': 'with errors',
    upload_another_file: 'Importer un jeu de donnée',
    upload_additional_file: 'Upload More',
    Cancel: 'Annuler',
    Username: "Nom d'utilisateur",
    Password: 'Mot de passe',
    line: 'ligne',
    error: 'erreur',
    atom: 'atom',
    publish: 'Publier',
    publication: 'Publication',
    publication_explanations:
        'Publishing will make your transformed data public. Once it has been published, y' +
        'ou will not be able to modify it.',
    published:
        "Vos données ont été publiées en ligne. Vous pouvez configurer davantage l'affichage de ces dernières ou les mettre à jour en utilisant l'interface publique",
    showing: 'Showing {from} to {to} of {total}',
    page: 'Page',
    perPage: 'par page',
    loading: 'Chargement...',
    loading_parsing_results: 'Loading parsing results',
    publication_preview: 'Aperçu',
    click_to_edit_publication_field: 'Click this field to edit it',
    add_transformer: 'Add an operation',
    add_class: 'Ajouter une classe',
    enter_class: 'Entrer votre classe',
    class: 'classe',
    remove_class: 'retirer la classe',
    annotate_class: 'Ajouter une nouvelle classe',
    remove_transformer: 'Remove this operation',
    fieldLabel: 'Label',
    fieldName: 'Name',
    fieldValue: 'Value',
    fieldScheme: 'Scheme',
    select_an_operation: 'Select an operation',
    cover: 'Cover',
    select_cover: 'Select a coverage',
    cover_dataset: 'Apply to whole dataset',
    cover_collection: 'Différent pour chaque ressource',
    cover_document: 'Présent uniquement sur certaines ressources',
    dataset_characteristics: 'Characteristics',
    export: 'Exporter en %{type}',
    sign_out: 'Se déconnecter',
    back_to_list: 'Retourner à la liste',
    settings: 'Settings',
    listen_up: 'Attention ! Cette action est destructive !',
    enter_name: "Entrer ci-dessous le nom de l'instance Lodex",
    danger_zone: 'Danger zone',
    clear: 'Nettoyer',
    clear_publish: 'Clear published',
    clear_dataset: 'Clear dataset',
    powered: 'Propulsé par',
    not_found: 'Resource not found',
    loading_resource: 'Resource loading...',
    error_label_required: 'Le label est requis',
    error_cover_required: 'Cover is required',
    error_scheme_invalid: 'scheme must be an url',
    error_position_invalid: 'Position is invalid (must be greater than zero)',
    error_position_required: 'Position is required',
    error_position_uri_must_come_first: 'URI field must be the first',
    error_transformers_contributions_no_transformers:
        'A contribution cannot have an operation',
    error_composedOf_contribution_no_composed_of:
        'A contribution cannot have a composedOf attribute',
    'error_composedOf.separator_required': 'ComposedOf separator is required',
    'error_composedOf.separator_invalid':
        'ComposedOf separator must be a string',
    'error_composedOf.fields_required':
        'ComposedOf must have at least two fields',
    'error_composedOf.fields_invalid': 'Fields of composition must exists',
    error_completes_inexisting_target_field: 'Annotated field must exists',
    error_label_invalid_label: 'Label must be at least 2 characters long',
    error_cover_invalid_contribution_cover:
        'A contribution must have a cover document',
    error_cover_invalid_cover: 'Cover must be either dataset or collection',
    error_language_invalid: 'Langue invalide',
    'error_transformer.operation_invalid':
        "L'opération %{operation} n'existe pas",
    'error_transformer.args_invalid':
        "L'opération %{operation} est invalide : arguments %{args} requis",
    remove_resource: 'Retirer la ressource',
    enter_reason: 'Donner en quelques mots une explication',
    reason: 'La raison',
    removed_resource_at: 'Cette ressource a été retirée - %{date}',
    cancel: 'Annuler',
    edit: 'Éditer',
    edit_field: 'Éditer %{field}',
    configure_field: 'Configurer %{field}',
    edit_ontology_field: '%{field} parameters',
    save: 'Sauvegarder',
    hide: 'Cacher',
    'add-field': 'Ajouter un champ',
    removed_resources: 'Ressources retirées',
    restore: 'Restaurer',
    removed_at: 'Removed at',
    removed_reason: 'La raison',
    add_field_to_resource: 'Ajouter un champ à cette ressource',
    about_you: 'Rédiger votre "À propos":',
    contributorName: 'Entrez votre nom',
    contributorMail: 'Entrez votre e-mail',
    select_contribution_field: 'Sélectionner un champ',
    new_contribution_field: 'Créer un nouveau champ',
    new_field: 'Champ',
    contributed_by: 'Contribution de %{name}',
    added_by: 'Ajouté par %{name}',
    add_to_publication: 'Add to publication',
    add_column: 'Ajouter une nouvelle colonne',
    no_dataset: 'Aucun jeu de données',
    scheme: 'scheme',
    format: 'format',
    exit_column_edition: "Retour à l'aperçu",
    upload_file: 'Importer un fichier',
    annotate_field: 'Annotate another field',
    completes_field_none: 'None',
    completes_field_X: 'Annotates %{field}',
    remove_from_publication: 'Supprimer',
    separator: 'séparateur',
    composed_of: 'Composé de',
    wizard_composed_of:
        'Compose this field - the following fields will be displayed under it',
    transformers: 'Opérations',
    add: 'ajout',
    remove: 'enlever',
    select_a_field: 'Sélectionner un champ',
    select_a_format: 'Appliquer un format',
    language: 'Langue',
    close: 'fermer',
    export_data: 'Exporter',
    export_fields: 'Exporter le modèle',
    import_fields: 'Importer le modèle',
    view_fields: 'View model',
    confirm_import_fields:
        'Importing a saved model will override your current work. Are you sure ?',
    import_fields_failed:
        "Your model couldn't be imported. Please ensure you selected the correct file.",
    no: 'Non',
    contributed_resources: 'Contributed resources',
    review: 'revue',
    contribution_filter: 'list resources with %{status} contribution',
    PROPOSED: 'proposé',
    VALIDATED: 'validé',
    REJECTED: 'rejeté',
    field_display_in_list: 'Display on list page',
    field_display_in_resource: 'Display on resource page',
    field_display_in_graph: 'Display in graph page',
    field_display_in_home: 'Display in home page',
    field_searchable: 'Searchable',
    filter: 'Vous pouvez saisir votre recherche ici',
    no_result: 'Aucune correspondance trouvée',
    field_is_facet: 'est une facette',
    add_facet: 'Ajouter une facette',
    select_facet_value: 'Sélectionner une valeur pour: %{facet}',
    add_column_from_original_dataset:
        'Ajouter une colonne depuis le jeu de données original',
    Login: 'Se connecter',
    show_publication_errors: 'Erreurs',
    model: 'Modèle',
    overview: 'Syndication',
    resource_details: 'Détails',
    share_export: 'Partager/Exporter',
    ontology: 'Ontologie',
    resources: 'Ressources',
    copy_to_clipboard: 'Copier',
    resource_share_link: 'Lien vers la ressource',
    dataset_share_link: 'Lien vers le jeu de données',
    share: 'Partager',
    columns: 'Colonnes',
    resource_share_export: 'Partager/Exporter',
    resource_ontology: 'Ontologie',
    versions: 'versions',
    latest: 'dernière',
    after_field: 'Après %{field}',
    first_position: 'En première position',
    position: 'Position',
    field_wizard_step_value: 'How the value is generated',
    field_wizard_step_tranforms: 'Transformations appliquées à cette valeur',
    field_wizard_step_identity: 'Informations génerales',
    field_wizard_step_display: 'How and where it is displayed',
    field_wizard_step_search: 'Search related',
    field_wizard_step_semantic: 'Sémantiques',
    previous: 'Précédent',
    next: 'Suivant',
    a_value: 'An arbitrary value',
    enter_a_value: 'Entrer une valeur',
    a_column: 'A value from an existing column',
    select_a_column: 'Sélectionner une colonne',
    a_composition: 'A value from multiple columns',
    enter_a_separator: 'Entrer un séparateur (optionnel)',
    remove_composition_column: 'Enlever',
    add_composition_column: 'Ajouter une autre colonne',
    an_autogenerated_uri: 'Générer les URI automatiquement',
    a_link_to_another_column: 'Un lien vers une autre colonne',
    select_a_ref_column: 'Select the column which identifies the linked column',
    select_an_id_column: 'Select the column which targets the linked column',
    add_characteristic: 'Ajouter une caractéristique',
    label: 'label',
    value: 'valeur',
    'add-field-to-resource': 'Ajouter un champ',
    valid: 'valider',
    instance_name: "Entrer le nom de l'instance",
    'semantic-publication-system': 'Système de publication sémantique',
    'modelize-your-data':
        'Modélisez et publiez vos données vers le web sémantique !',
    'easy-creation':
        'Créez facilement votre site web personnalisé à partir de vos fichiers CSV, XML, etc.',
    'semantic-web-compatibility':
        "Vos référentiels, thésaurus, résultats d'expérimentation seront compatibles avec le Web Sémantique !",
    'easy-update':
        'Vous pourrez toujours facilement les modifier et les enrichir avec une garantie de traçabilité.',
    'first-upload': 'Commencez en chargeant un fichier de données.',
    'publish-punchline':
        'Publiez vos données, vous pourrez toujours facilement les modifier et les enrichir à posteriori avec une garantie de traçabilité.',
    remove_column: 'Remove this column(FR)',
    multi_field_concat: 'A list of values from several existing columns(FR)',
    duplicated_uri:
        '%{nbInvalidUri} documents have duplicated uri and will not be published',
    warn_publication:
        "Attention: l'uri n'est pas unique sur tous les documents",
    force_publish: 'Publish anyway',
    embed_widget: 'Intégrer cette ressource sur votre site',
    select_exported_fields_all: 'Tous les champs',
    select_exported_fields: 'Sélectionner les champs à afficher dans le widget',
    filter_fields_for_widgets: 'Type here to filter the list of fields',
    widget: 'Widget par défaut',
    list_format_select_type: 'Selection du type de la liste',
    list_format_unordered: 'Liste désordonnée',
    list_format_ordered: 'Liste ordonnée',
    uri_format_select_type: 'How is the label defined ?',
    uri_format_column: 'Label is the column content',
    uri_format_custom: 'List is a custom text (same for all resources)',
    uri_format_another_column: 'Label is the content of another column',
    uri_format_custom_value: 'The custom text',
    uri_format_another_column_value: 'La colonne',
    'TypeError: Failed to fetch': "Impossible d'accéder à l'API",
    istex_results: 'Résultats de la recherche ISTEX pour %{searchTerm}:',
    istex_total: '%{total} résultats',
    none: 'Aucun',
    description: 'Description',
    navigate_to_published_data: 'Se rendre sur les données publiées',
    moderation: 'Modération',
    apply: 'Appliquer',
    details: 'Détails',
    auto_generate_uri: 'Leave empty to autogenerate uri',
    required: 'Requis',
    invalid_uri:
        'Une Uri doit toujours commencer par /:uid ou /:ark ou doit être une URL valide',
    create_resource: 'Créer une nouvelle ressource',
    uri_conflict: 'Un document existe déjà avec la même URI',
    supported_format_list: 'Liste des formats de fichier supportés:',
    composed_of_fields: 'Composé de %{fields}',
    field_label_exists: 'Le champ existe déjà',
    raw: 'JSON',
    csv: 'CSV',
    tsv: 'TSV',
    jsonld: 'JSON-LD',
    min: 'Min',
    jsonldcompacted: 'JSON-LD (Compacté)',
    nquads: 'N-Quads',
    extendednquads: 'N-Quads Étendus',
    extendednquadscompressed: 'N-Quads Étendus (Compressé)',
    turtle: 'Turtle',
    upload_url: 'Importer depuis une URL',
    invalid_url: 'url invalide',
    or: 'ou',
    html: 'Balises HTML',
    list: 'Liste de valeurs',
    uri: 'Lien interne',
    email: 'Lien courriel',
    image: "URL d'une image",
    link: 'URL externe',
    contextualBarchart: 'Graphique contextuel',
    istex: 'Requête ISTEX',
    markdown: 'Syntaxe Markdown',
    ten_percent: '10 %',
    twenty_percent: '20 %',
    thirty_percent: '30 %',
    fifty_percent: '50 %',
    eighty_percent: '80 %',
    hundred_percent: '100 %',
    list_format_select_image_width: 'Pourcentage de la largeur',
    title: 'Titre',
    level1: 'Titre 1',
    level2: 'Titre 2',
    level3: 'Titre 3',
    level4: 'Titre 4',
    list_format_select_level: 'Niveau du titre',
    dataset: 'Jeu de données',
    paragraph: 'Paragraphe',
    identifier: 'Identifiant',
    count_of_field: 'Nb. de doc.',
    resource: 'Ressource',
    globalPiechart: 'Diagramme circulaire',
    globalRadarchart: 'Diagramme radar',
    globalBarchart: 'Diagramme en barres',
    max_fields: 'Nombre max de champs',
    colors_set: 'Jeu de couleurs',
    order_by: 'Trier par',
    label_asc: 'Label ↗',
    label_desc: 'Label ↘',
    value_desc: 'Valeur ↘',
    value_asc: 'Valeur ↗',
    size1: 'Très grand',
    size2: 'Grand',
    size3: 'Gras',
    size4: 'Normal',
    list_format_select_size: 'Taille',
    identifierBadge: 'Badge pour identifiant',
    list_format_select_identifier: 'Service de résolution',
    sentence: 'Phrase',
    prefix: 'prefix',
    suffix: 'suffix',
    automatic: 'Automatique',
    parser_name: 'Nom du parser',
    select_file: 'Choix de fichier à charger',
    select_parser: 'Choix du parser à appliquer',
    bad_format:
        'Format inapproprié pour %{label}, simple valeur attendue mais tableau reçu, essayer le format liste',
    field_width: 'largeur',
    graph_list: 'graph list',
    filter_value: 'filter %{field}',
    exclude: 'exclude',
    count: 'count',
    no_chart_data: 'no data to visualize',
    chart_error: 'Error while trying to retrieve chart data',
    excluding: 'excluding',
    axis_round_value: 'force round value in axis',
    scale: 'scale',
    linear: 'linear',
    log: 'logarithmic',
    home: 'home',
    color_scheme: 'color scheme',
    hover_color_scheme: 'hover color scheme',
    default_color: 'default color',
    cartography: 'cartography',
    emphasedNumber: 'emphasedNumber',
    resourcesGrid: 'resourcesGrid',
    trelloTimeline: 'trelloTimeline',
    direction: 'direction',
    horizontal: 'horizontal',
    vertical: 'vertical',
    max_value: 'max value',
    min_value: 'min value',
    flip_axis: 'flip axis',
    value_margin: 'margin for value axis (px)',
    category_margin: 'margin for category axis (px)',
    diagonal_value_axis: 'display value axis in diagonal',
    diagonal_category_axis: 'display category axis in diagonal',
    all: 'All',
    document: 'Document',
    node_color: 'Node Color',
    network: 'network',
    bubbleChart: 'Bubble',
    width: 'Width',
    height: 'Height',
    min_radius: 'Min radius',
    max_radius: 'Max radius',
};
