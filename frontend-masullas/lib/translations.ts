// Translation system for Italian (default) and English
'use client'

import { useState, useEffect } from 'react'

export type Language = 'it' | 'en'

interface Translations {
  [key: string]: any
}

const translations: Record<Language, Translations> = {
  it: {
    // Navigation & Common
    common: {
      home: "Home",
      dashboard: "Dashboard", 
      login: "Accedi",
      register: "Registrati",
      logout: "Esci",
      back: "Indietro",
      save: "Salva",
      cancel: "Annulla",
      loading: "Caricamento...",
      error: "Errore",
      success: "Successo",
      refresh: "Aggiorna",
      language: "Lingua",
      italian: "Italiano",
      english: "Inglese",
      edit: "Modifica",
      delete: "Elimina",
      add: "Aggiungi",
      view: "Visualizza",
      status: "Stato",
      active: "Attivo",
      inactive: "Inattivo",
      enabled: "Abilitato",
      disabled: "Disabilitato",
      on: "Acceso",
      off: "Spento",
      submit: "Invia",
      close: "Chiudi",
      open: "Apri",
      confirm: "Conferma",
      search: "Cerca",
      filter: "Filtra",
      settings: "Impostazioni",
      openMenu: "Apri menu",
      closeMenu: "Chiudi menu",
      faq: "FAQ",
      previous: "Precedente",
      next: "Successivo",
      goToPreviousPage: "Vai alla pagina precedente",
      goToNextPage: "Vai alla pagina successiva",
      morePages: "Altre pagine"
    },

    // Dashboard Navigation
    nav: {
      overview: "Panoramica",
      controls: "Controlli",
      usage: "Utilizzo",
      bookings: "Prenotazioni", 
      profile: "Profilo",
      support: "Supporto",
      subscription: "Abbonamento",
      admin: "Amministrazione",
      users: "Utenti",
      campsites: "Piazzole",
      devices: "Dispositivi",
      analytics: "Analitiche"
    },

    // Dashboard
    dashboard: {
      welcome: "Benvenuto",
      welcomeBack: "Bentornato",
      currentBooking: "Prenotazione Attuale",
      noActiveBooking: "Nessuna prenotazione attiva",
      quickActions: "Azioni Rapide",
      recentActivity: "Attività Recente",
      systemStatus: "Stato del Sistema",
      weatherInfo: "Informazioni Meteo",
      notifications: "Notifiche",
      refresh: "Aggiorna",
      errorLoadingDashboard: "Errore nel caricamento della dashboard",
      retry: "Riprova",
      toggleSidebar: "Attiva/disattiva barra laterale",
      viewProfile: "Visualizza Profilo",
      
      // First booking overlay
              welcomeToTergucamperarea: "Benvenuto su Tergucamperarea!",
      firstBookingMessage: "Per iniziare, dovrai richiedere la tua prima prenotazione di campeggio",
      noBookingsYet: "Non hai ancora prenotazioni. Richiedi la tua prima prenotazione per utilizzare i nostri servizi di campeggio intelligenti.",
      afterBookingApproval: "Dopo l'approvazione della tua prenotazione, potrai:",
      controlUtilities: "Controllare le utility del tuo campeggio da remoto",
      monitorUsage: "Monitorare l'utilizzo delle tue risorse",
      accessFeatures: "Accedere a tutte le funzionalità della dashboard",
      requestFirstBooking: "Richiedi la Tua Prima Prenotazione",
      
      // Status badges
      activeBooking: "Prenotazione Attiva",
      upcomingBooking: "Prossima Prenotazione",
      pendingApproval: "In Attesa di Approvazione",
      noBookingsFound: "Nessuna Prenotazione Trovata",
      
      // Booking details
      daysRemaining: "giorni rimanenti",
      startsIn: "Inizia tra",
      days: "giorni",
      from: "Da",
      waitingForApproval: "In attesa di approvazione",
      bookingRequest: "Richiesta di Prenotazione",
      campsite: "Piazzola",
      
      // Device status
      deviceOnline: "Dispositivo Online",
      deviceOffline: "Dispositivo Offline",
      
      // Actions
      goToControls: "Vai ai Controlli",
      viewBookingDetails: "Visualizza Dettagli Prenotazione",
      viewRequestStatus: "Visualizza Stato Richiesta",
      requestBooking: "Richiedi Prenotazione",
      
      // Quick controls
      quickControls: "Controlli Rapidi",
      advancedControls: "Controlli avanzati",
      electricity: "Elettricità",
      waterSupply: "Fornitura Acqua",
      gateBarrier: "Barriera Cancello",
      readOnly: "Solo Lettura",
      open: "APERTO",
      closed: "CHIUSO",
      on: "ACCESO",
      off: "SPENTO",
      
      // Page titles
      pageTitles: {
        dashboard: "Dashboard",
        myBookings: "Le Mie Prenotazioni",
        campsiteControl: "Controllo Piazzola",
        usageHistory: "Cronologia Utilizzo",
        helpSupport: "Aiuto e Supporto",
        profile: "Profilo"
      },
      
      // Navigation
      navigation: {
        dashboard: "Dashboard",
        myBookings: "Le Mie Prenotazioni",
        campsiteControl: "Controllo Piazzola",
        usageHistory: "Cronologia Utilizzo",
        helpSupport: "Aiuto e Supporto"
      },
      
      
      overview: {
        title: "Panoramica Dashboard",
        subtitle: "Gestisci le tue prenotazioni e dispositivi campeggio",
        totalBookings: "Prenotazioni Totali",
        activeDevices: "Dispositivi Attivi",
        energyUsage: "Utilizzo Energetico",
        waterUsage: "Utilizzo Acqua",
        lastActivity: "Ultima Attività",
        deviceStatus: "Stato Dispositivi",
        allSystemsOperational: "Tutti i sistemi operativi",
        someIssuesDetected: "Alcuni problemi rilevati",
        criticalIssuesDetected: "Problemi critici rilevati"
      },

      controls: {
        title: "Controlli Piazzola",
        subtitle: "Gestisci le utility per la tua piazzola selezionata",
        loading: "Caricamento controlli...",
        
        // Device status
        online: "Online", 
        offline: "Offline",
        
        // No booking state
        noActiveBookingTitle: "Nessuna Prenotazione Attiva",
        noActiveBookingMessage: "Hai bisogno di una prenotazione attiva per controllare le utility della piazzola. Prenota una piazzola per accedere al pannello di controllo.",
        requestBooking: "Richiedi Prenotazione",
        
        // Error states
        errorLoadingControls: "Errore nel Caricamento Controlli",
        retryLoadingProfile: "Riprova Caricamento Profilo",
        stateUpdateError: "Errore Aggiornamento Stato",
        stateUpdateErrorMessage: "I controlli potrebbero non riflettere lo stato reale.",
        
        // Utilities
        electricity: "Elettricità",
        waterSupply: "Fornitura Acqua",
        gateBarrier: "Barriera Cancello",
        
        // Status labels
        on: "ACCESO",
        off: "SPENTO",
        open: "APERTO",
        closed: "CHIUSO",
        readOnly: "Solo Lettura",
        
        // Barrier actions
        openBarrier: "Apri Barriera",
        closeBarrier: "Chiudi Barriera",
        opening: "Apertura...",
        closing: "Chiusura...",
        
        // Toast messages
        commandSent: "Comando Inviato",
        commandSuccessful: "comando riuscito.",
        error: "Errore",
        
        // Accessibility
        toggleElectricity: "Attiva/Disattiva Elettricità",
        refreshControls: "Aggiorna Controlli",
        openBarrierLabel: "Apri Barriera",
        closeBarrierLabel: "Chiudi Barriera",
        
        // Campsite selector
        campsiteSelector: {
          selectCampsite: "Seleziona Piazzola",
          campsite: "Piazzola",
          active: "Attiva",
          pending: "In Sospeso",
          expired: "Scaduta",
          failedToLoadCampsites: "Impossibile caricare le piazzole"
        }
      },

      usage: {
        title: "Utilizzo e Cronologia",
        subtitle: "Visualizza il tuo utilizzo di elettricità e la cronologia",
        viewingDataFor: "Visualizzazione dati per",
        
        // Summary cards
        bookingPeriod: "Periodo Prenotazione",
        singleDayBooking: "Prenotazione di un singolo giorno",
        deviceStatus: "Stato Dispositivo",
        lastConnected: "Ultima connessione",
        electricityUsage: "Utilizzo Elettricità",
        totalConsumptionToday: "Consumo totale oggi",
        
        // Units and measurements
        kwh: "kWh",
        online: "ONLINE",
        offline: "OFFLINE",
        
        // History section
        commandStateHistory: "Cronologia Comandi e Stati",
        showingMostRecent: "Mostra i comandi e i cambiamenti di stato più recenti",
        recordsOf: "di",
        records: "record",
        
        // Empty state
        noCommandHistory: "Nessuna Cronologia Comandi",
        noHistoryMessage: "Non è presente alcuna cronologia di comandi o cambiamenti di stato registrata per il tuo periodo di prenotazione attivo.",
        
        // Command descriptions
        electricityControl: "Controllo Elettricità",
        waterControl: "Controllo Acqua",
        barrierControl: "Controllo Barriera",
        stateUpdate: "Aggiornamento Stato",
        changedStateTo: "Stato cambiato a",
        opened: "Aperto",
        closed: "Chiuso",
        on: "ACCESO",
        off: "SPENTO",
        open: "APERTO",
        electricity: "Elettricità",
        water: "Acqua",
        barrier: "Barriera",
        stateValuesUpdated: "Valori stato aggiornati",
        
        // Actions
        loadMore: "Carica di più",
        refreshData: "Aggiorna dati",
        source: "Fonte",
        
        // Error states
        error: "Errore",
        noActiveBookingTitle: "Nessuna Prenotazione Attiva",
        noActiveBookingMessage: "Non hai una prenotazione piazzola attiva per oggi.",
        noCampsiteAssignedTitle: "Nessuna Piazzola Assegnata",
        noCampsiteAssignedMessage: "La tua prenotazione non ha ancora una piazzola assegnata.",
        
        // Toast messages
        noActiveBookingToast: "Non hai una prenotazione piazzola attiva per oggi.",
        noCampsiteToast: "La tua prenotazione non ha una piazzola assegnata ancora.",
        errorToast: "Impossibile caricare i dati della piazzola",
        failedToFetch: "Impossibile recuperare i dati della piazzola"
      },

      bookings: {
        title: "Le Mie Prenotazioni",
        subtitle: "Visualizza e gestisci le richieste di prenotazione piazzola",
        currentBookings: "Prenotazioni Correnti",
        pastBookings: "Prenotazioni Passate",
        upcomingBookings: "Prenotazioni Future",
        createBooking: "Nuova Prenotazione",
        requestNewBooking: "Richiedi Nuova Prenotazione",
        filterByStatus: "Filtra per stato",
        allBookings: "Tutte le Prenotazioni",
        bookingDetails: "Dettagli Prenotazione",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Ospiti",
        campsite: "Piazzola",
        duration: "Durata",
        totalCost: "Costo Totale",
        paymentStatus: "Stato Pagamento",
        paid: "Pagato",
        pending: "In Attesa",
        approved: "Approvata",
        active: "Attiva",
        completed: "Completata",
        cancelled: "Cancellata",
        confirmed: "Confermato",
        extendBooking: "Estendi Prenotazione",
        cancelBooking: "Annulla Prenotazione",
        nights: "notti",
        bookingId: "ID Prenotazione",
        refreshBookings: "Aggiorna prenotazioni",
        
        // Table headers
        status: "Stato",
        dates: "Date",
        actions: "Azioni",
        to: "a",
        viewDetails: "Visualizza Dettagli",
        cancel: "Annulla",
        controls: "Controlli",
        
        // Empty states
        noBookingsFound: "Nessuna prenotazione trovata",
        noBookingsMessage: "Non hai ancora richiesto prenotazioni piazzola. Crea la tua prima prenotazione per iniziare.",
        noMatchingFilter: "Nessuna prenotazione corrisponde al filtro attuale. Prova a modificare il filtro o visualizza tutte le prenotazioni.",
        
        // Booking details dialog
        bookingDetailsTitle: "Dettagli e informazioni prenotazione",
        bookingInformation: "Informazioni Prenotazione",
        paymentDetails: "Dettagli Pagamento",
        adminNotes: "Note Amministratore",
        requestTimeline: "Timeline Richiesta",
        yourNotes: "Le Tue Note",
        
        // Booking info labels
        datesLabel: "Date",
        daysLabel: "giorni",
        campsiteLabel: "Piazzola",
        pendingAssignment: "Assegnazione in Sospeso",
        preferred: "Preferita",
        paymentMethod: "Metodo di Pagamento",
        
        // Timeline events
        bookingRequested: "Prenotazione Richiesta",
        bookingApproved: "Prenotazione Approvata",
        bookingActivated: "Prenotazione Attivata",
        bookingCancelled: "Prenotazione Cancellata",
        bookingCompleted: "Prenotazione Completata",
        reason: "Motivo",
        
        // Dialog actions
        close: "Chiudi",
        
        // Request form dialog
        requestNewBookingTitle: "Richiedi Nuova Prenotazione",
        requestFormDescription: "Compila il modulo sottostante per richiedere una nuova prenotazione piazzola",
        
        // Status dialog
        bookingSuccessful: "Prenotazione Riuscita",
        bookingFailed: "Prenotazione Fallita",
        errorDetails: "Dettagli Errore",
        viewMyBookings: "Visualizza Le Mie Prenotazioni",
        tryAgain: "Riprova",
        
        // Cancel confirmation
        cancelBookingTitle: "Annulla Prenotazione",
        cancelConfirmation: "Sei sicuro di voler cancellare questa prenotazione? Questa azione non può essere annullata.",
        keepBooking: "Mantieni Prenotazione",
        yesCancelBooking: "Sì, Annulla Prenotazione",
        
        // Format placeholders
        invalidDate: "Data Non Valida",
        notAvailable: "N/D",
        
        // Toast messages
        bookingDataRefreshed: "Dati prenotazione aggiornati con successo.",
        failedToLoadBookings: "Impossibile caricare le tue prenotazioni. Riprova più tardi.",
        bookingCancelledSuccess: "La tua prenotazione è stata cancellata con successo.",
        failedToCancelBooking: "Impossibile cancellare la prenotazione. Riprova.",
        
        // Request form translations
        requestForm: {
          // Form sections
          dateSelection: "Selezione Date",
          contactInformation: "Informazioni di Contatto", 
          bookingDetails: "Dettagli Prenotazione",
          
          // Date fields
          checkInDate: "Data Check-in",
          checkOutDate: "Data Check-out",
          selectDate: "Seleziona data",
          
          // Duration and dates
          duration: "Durata",
          day: "giorno",
          days: "giorni",
          maxBookingDuration: "Durata massima prenotazione",
          
          // Contact fields
          phoneNumber: "Numero di Telefono",
          phoneNumberPlaceholder: "Inserisci il tuo numero di telefono",
          emailAddress: "Indirizzo Email",
          emailAddressPlaceholder: "Inserisci il tuo indirizzo email",
          
          // Payment and notes
          paymentMethod: "Metodo di Pagamento",
          selectPaymentMethod: "Seleziona metodo di pagamento",
          creditCard: "Carta di Credito",
          paypal: "PayPal",
          bankTransfer: "Bonifico Bancario",
          specialRequests: "Richieste Speciali (Opzionale)",
          specialRequestsPlaceholder: "Eventuali richieste speciali o note per la tua prenotazione...",
          
          // Price summary
          pricePerDay: "Prezzo al giorno",
          totalPrice: "Prezzo Totale",
          
          // Form actions
          cancel: "Annulla",
          submitBookingRequest: "Invia Richiesta Prenotazione",
          submitting: "Invio in corso...",
          
          // Error messages
          errorTitle: "Errore",
          pleaseProvidePhone: "Si prega di fornire un numero di telefono di contatto",
          pleaseProvideEmail: "Si prega di fornire un indirizzo email di contatto", 
          bookingMinimumDays: "La prenotazione deve essere di almeno 1 giorno",
          bookingMaximumDays: "La prenotazione non può superare i {maxDays} giorni",
          failedToCreateRequest: "Impossibile creare la richiesta di prenotazione. Riprova.",
          
          // Success messages
          requestSubmittedSuccess: "La tua richiesta di prenotazione è stata inviata con successo. Sarai avvisato quando verrà approvata.",
          failedToCreateRequestTitle: "Impossibile creare la richiesta di prenotazione.",
          unexpectedError: "Si è verificato un errore imprevisto. Riprova più tardi."
        }
      },

      profile: {
        title: "Il Mio Profilo",
        refreshProfile: "Aggiorna Profilo",
        
        // User Information Section
        userInformation: "Informazioni Utente",
        yourAccountDetails: "I dettagli del tuo account",
        name: "Nome",
        email: "Email",
        phoneNumber: "Numero di Telefono",
        memberSince: "Membro da",
        
        // Booking Summary Section
        bookingSummary: "Riepilogo Prenotazioni",
        recentUpcomingBookings: "Le tue prenotazioni recenti e future",
        viewAllBookings: "Visualizza Tutte le Prenotazioni",
        
        // Booking Status Labels
        active: "Attiva",
        approved: "Approvata",
        pending: "In Sospeso",
        completed: "Completata",
        cancelled: "Cancellata",
        
        // Booking Actions
        controlPanel: "Pannello di Controllo",
        viewDetails: "Visualizza Dettagli",
        checkStatus: "Controlla Stato",
        bookingRequest: "Richiesta Prenotazione",
        
        // Empty States
        noActiveUpcomingBookings: "Nessuna prenotazione attiva o futura",
        requestABooking: "Richiedi una Prenotazione",
        
        // Recent History
        recentBookingHistory: "Cronologia Prenotazioni Recenti",
        yourPastBookings: "Le tue prenotazioni passate",
        total: "Totale",
        bookAgain: "Prenota di Nuovo",
        viewAllBookingsCount: "Visualizza tutte le {count} prenotazioni",
        
        // Error States
        error: "Errore",
        failedToLoadProfile: "Impossibile caricare il tuo profilo. Riprova più tardi.",
        tryAgain: "Riprova",
        
        // Format helpers
        notAvailable: "N/D"
      },

      support: {
        title: "Aiuto e Supporto",
        subtitle: "Trova risposte a domande comuni o contatta il nostro team di supporto",
        
        // Contact Support Section
        contactSupport: "Contatta il Supporto",
        waysToReach: "Modi per raggiungere il nostro team di supporto per assistenza immediata",
        emailSupport: "Supporto Email",
        responseTime24to48: "Tempo di risposta: 24-48 ore",
        phoneSupport: "Supporto Telefonico",
        urgentIssuesOnly: "Solo per problemi urgenti",
        supportHours: "Orari Supporto",
        mondayToFriday: "Lunedì a Venerdì: 9:00 - 18:00",
        saturday: "Sabato: 10:00 - 16:00",
        sunday: "Domenica: Chiuso",
        needImmediateAssistance: "Hai bisogno di assistenza immediata?",
        urgentIssuesCall: "Per problemi urgenti, chiama la nostra linea di supporto durante gli orari lavorativi.",
        
        // FAQ Section
        frequentlyAskedQuestions: "Domande Frequenti",
        findAnswersCommon: "Trova risposte alle nostre domande più frequenti",
        
        // FAQ Categories
        bookingQuestions: "Domande sulle Prenotazioni",
        deviceControlQuestions: "Domande sul Controllo Dispositivi",
        accountQuestions: "Domande sull'Account",
        technicalSupport: "Supporto Tecnico",
        
        // Booking Questions
        howToBookCampsite: "Come prenoto una piazzola?",
        howToBookAnswer: "Puoi prenotare una piazzola navigando nella sezione \"Le Mie Prenotazioni\" e cliccando sul pulsante \"Richiedi Nuova Prenotazione\". Segui le istruzioni del modulo per completare la prenotazione.",
        cancellationPolicy: "Qual è la politica di cancellazione?",
        cancellationAnswer: "Le prenotazioni possono essere cancellate fino a 48 ore prima della data di inizio per un rimborso completo. Le cancellazioni effettuate entro 48 ore dalla data di inizio possono comportare una commissione di cancellazione.",
        howToExtendBooking: "Come estendo la mia prenotazione?",
        extendBookingAnswer: "Le prenotazioni attive possono essere estese attraverso la sezione \"Le Mie Prenotazioni\". Trova la tua prenotazione attiva, clicca \"Visualizza Dettagli\" e poi \"Estendi Soggiorno\". Le estensioni sono soggette a disponibilità.",
        bookingDurationLimit: "Per quanto tempo posso prenotare una piazzola?",
        durationLimitAnswer: "Le prenotazioni possono essere fatte per un minimo di 1 giorno e un massimo di 30 giorni. Per soggiorni più lunghi, contatta il nostro team di supporto.",
        
        // Device Control Questions
        howToControlUtilities: "Come controllo le utility della mia piazzola?",
        controlUtilitiesAnswer: "Una volta che hai una prenotazione attiva, naviga nella sezione \"Controllo Piazzola\" dove troverai interruttori per controllare elettricità, acqua e barriera/cancello.",
        whatIfLoseConnection: "Cosa succede se perdo la connessione internet?",
        loseConnectionAnswer: "Il sistema mantiene i tuoi ultimi stati impostati. Se perdi la connessione, le utility della tua piazzola continueranno a funzionare in base ai tuoi ultimi comandi fino al ripristino della connessione.",
        usageLimits: "C'è un limite a quanta elettricità/acqua posso usare?",
        usageLimitsAnswer: "Sì, ogni piazzola ha un limite di utilizzo giornaliero di 100 kWh per l'elettricità e 500 litri per l'acqua. Puoi monitorare il tuo utilizzo nella sezione \"Cronologia Utilizzo\".",
        deviceOfflineWhat: "Cosa devo fare se un dispositivo appare offline?",
        deviceOfflineAnswer: "Se un dispositivo mostra come offline, prova prima ad aggiornare la pagina. Se rimane offline, contatta il nostro team di supporto per assistenza.",
        
        // Account Questions
        howToUpdateProfile: "Come aggiorno le informazioni del mio profilo?",
        updateProfileAnswer: "Puoi aggiornare le informazioni del tuo profilo navigando nella sezione \"Profilo\" nel dashboard. Clicca su \"Modifica Profilo\" per aggiornare i tuoi dati personali.",
        forgotPassword: "Cosa faccio se ho dimenticato la password?",
        forgotPasswordAnswer: "Se hai dimenticato la password, clicca sul link \"Password Dimenticata\" nella pagina di accesso. Riceverai un'email con istruzioni per reimpostare la password.",
        personalDataUsage: "Come vengono usati i miei dati personali?",
        dataUsageAnswer: "Utilizziamo i tuoi dati personali solo per gestire i nostri servizi e migliorare la tua esperienza. Non condividiamo mai i tuoi dati con terze parti senza il tuo consenso. Per maggiori dettagli, consulta la nostra Informativa sulla Privacy.",
        
        // Technical Support Questions
        supportedBrowsers: "Quali browser sono supportati?",
        browsersAnswer: "La nostra piattaforma funziona meglio sulle versioni più recenti di Chrome, Firefox, Safari ed Edge. Per la migliore esperienza, mantieni il tuo browser aggiornato.",
        howToReportTechnical: "Come segnalo un problema tecnico?",
        reportTechnicalAnswer: "Puoi segnalare problemi tecnici attraverso le informazioni di contatto fornite nella sezione supporto. Fornisci quanti più dettagli possibili, inclusi screenshot se applicabili.",
        mobileAppAvailable: "È disponibile l'app mobile?",
        mobileAppAnswer: "La nostra app mobile è attualmente in sviluppo. Nel frattempo, il nostro sito web è completamente responsivo e funziona bene sui dispositivi mobili.",
        systemNotResponding: "Cosa devo fare se il sistema non risponde?",
        systemNotRespondingAnswer: "Se il sistema non risponde, prova ad aggiornare la pagina o svuotare la cache del browser. Se il problema persiste, contatta il nostro team di supporto."
      },

      subscription: {
        title: "Il Mio Abbonamento",
        subtitle: "Gestisci il tuo piano di abbonamento",
        currentPlan: "Piano Attuale",
        planDetails: "Dettagli Piano",
        billingHistory: "Cronologia Fatturazione",
        paymentMethod: "Metodo di Pagamento",
        nextBilling: "Prossima Fatturazione",
        changePlan: "Cambia Piano",
        cancelSubscription: "Annulla Abbonamento",
        renewSubscription: "Rinnova Abbonamento",
        upgradeDowngrade: "Aggiorna/Declassa",
        planFeatures: "Caratteristiche Piano",
        pricePerMonth: "Prezzo al Mese",
        pricePerYear: "Prezzo all'Anno",
        basic: "Base",
        premium: "Premium", 
        pro: "Professionale",
        unlimited: "Illimitato",
        features: "Caratteristiche"
      }
    },

    // Admin Dashboard
    admin: {
      title: "Pannello Amministrativo",
      subtitle: "Gestisci utenti, piazzole e dispositivi del sistema",
      
      // Admin Layout & Navigation
      layout: {
        toggleSidebar: "Attiva/disattiva barra laterale",
        tergucamperareaAdmin: "Tergucamperarea Admin",
        logout: "Esci",
        admin: "Admin",
        
        // Navigation items
        dashboard: "Dashboard",
        users: "Utenti", 
        bookings: "Prenotazioni",
        campsites: "Piazzole",
        devices: "Dispositivi",
        settings: "Impostazioni",
        
        // Page titles
        pageTitles: {
          adminDashboard: "Dashboard Amministrativa",
          userManagement: "Gestione Utenti",
          bookingManagement: "Gestione Prenotazioni", 
          campsiteManagement: "Gestione Piazzole",
          deviceManagement: "Gestione Dispositivi",
          systemSettings: "Impostazioni Sistema",
          systemHealth: "Salute del Sistema"
        }
      },
      
      overview: {
        title: "Panoramica del Sistema",
        subtitle: "Monitoraggio e gestione in tempo reale",
        lastUpdated: "Ultimo aggiornamento",
        refresh: "Aggiorna",
        retry: "Riprova",
        
        // Error states
        errorLoadingDashboard: "Errore nel Caricamento Dashboard",
        errorLoadingData: "Impossibile caricare i dati della dashboard. Riprova più tardi.",
        errorLoadingAnalytics: "Impossibile caricare i dati analitici. Riprova più tardi.",
        failedToFetchDashboard: "Impossibile recuperare i dati della dashboard",
        failedToFetchHealth: "Impossibile recuperare i dati di salute del sistema",
        failedToFetchAnalytics: "Impossibile recuperare i dati analitici",
        
        // Main stats cards
        totalUsers: "Utenti Totali",
        totalDevices: "Dispositivi Totali",
        totalCampsites: "Piazzole Totali",
        activeBookings: "Prenotazioni Attive",
        
        // Status labels
        admins: "amministratori",
        users: "utenti",
        online: "online",
        offline: "offline",
        available: "disponibili",
        occupied: "occupate",
        pending: "in sospeso",
        completed: "completate",
        
        // System health section
        systemHealth: "Salute del Sistema",
        environment: "Ambiente",
        region: "Regione",
        unknown: "Sconosciuto",
        healthScore: "Punteggio Salute",
        healthy: "Sano",
        degraded: "Degradato",
        unhealthy: "Non Sano",
        notConfigured: "Non Configurato",
        
        // Health details
        overallStatus: "Stato Generale",
        databaseConnections: "Connessioni Database",
        externalServices: "Servizi Esterni",
        systemComponents: "Componenti Sistema",
        statistics: "Statistiche",
        
        // Statistics breakdown
        devices: "Dispositivi",
        campsites: "Piazzole",
        bookings: "Prenotazioni",
        commands24h: "Comandi (24h)",
        maintenance: "Manutenzione",
        active: "Attive",
        approved: "Approvate",
        success: "Successo",
        failed: "Falliti",
        successRate: "Tasso di Successo",
        
        // Runtime information
        runtimeInformation: "Informazioni Runtime",
        nodejsVersion: "Versione Node.js",
        memoryLimit: "Limite Memoria",
        lambdaFunction: "Funzione Lambda",
        
        // Pending approvals section
        pendingApprovals: "Approvazioni in Sospeso",
        newPending: "nuove",
        bookingsRequiringAttention: "Prenotazioni che richiedono attenzione immediata",
        review: "Rivedi",
        viewAllPending: "Visualizza Tutte le Sospese",
        
        // General
        total: "Totale",
        arrowUpRight: "Vai a",
        loading: "Caricamento...",
        noData: "Nessun dato disponibile"
      },
      
      users: {
        title: "Gestione Utenti",
        subtitle: "Visualizza e gestisci gli utenti del sistema",
        refresh: "Aggiorna",
        
        // Statistics
        totalUsers: "Utenti Totali",
        adminUsers: "Utenti Admin",
        regularUsers: "Utenti Normali",
        
        // Table and filters
        systemUsers: "Utenti del Sistema",
        filterByRole: "Filtra per ruolo",
        allRoles: "Tutti i Ruoli",
        admin: "Admin",
        regularUser: "Utente Normale",
        searchByEmail: "Cerca per email...",
        
        // Table headers
        user: "Utente",
        role: "Ruolo",
        registered: "Registrato",
        actions: "Azioni",
        viewDetails: "Visualizza Dettagli",
        deleteUser: "Elimina Utente",
        
        // Empty states
        noUsersFound: "Nessun Utente Trovato",
        noUsersMatch: "Nessun utente corrisponde ai criteri di ricerca. Prova ad aggiustare i filtri.",
        noUsersInSystem: "Non ci sono ancora utenti nel sistema.",
        
        // Error states
        error: "Errore",
        failedToFetchUsers: "Impossibile recuperare gli utenti",
        failedToLoadUsers: "Impossibile caricare gli utenti. Riprova più tardi.",
        failedToFetchUserDetails: "Impossibile recuperare i dettagli utente",
        failedToLoadUserDetails: "Impossibile caricare i dettagli utente. Riprova più tardi.",
        failedToDeleteUser: "Impossibile eliminare l'utente",
        
        // User details
        userDetails: "Dettagli Utente",
        accountInformation: "Informazioni Account",
        userId: "ID Utente",
        emailAddress: "Indirizzo Email",
        registrationDate: "Data Registrazione",
        
        // Campsites section
        assignedCampsites: "Piazzole Assegnate",
        campsiteId: "ID Piazzola",
        status: "Stato",
        assignedDate: "Data Assegnazione", 
        expiryDate: "Data Scadenza",
        active: "Attiva",
        expired: "Scaduta",
        inactive: "Inattiva",
        
        // Subscription requests
        subscriptionRequests: "Richieste Abbonamento",
        requestDate: "Data Richiesta",
        type: "Tipo",
        approved: "Approvata",
        rejected: "Rifiutata",
        pending: "In Sospeso",
        
        // Delete confirmation
        deleteUserAccount: "Elimina Account Utente",
        deleteConfirmation: "Sei sicuro di voler eliminare permanentemente l'account utente per",
        actionCannotBeUndone: "Questa azione non può essere annullata e comporterà:",
        deleteAccountPermanently: "Eliminare permanentemente l'account utente",
        cancelPendingBookings: "Annullare prenotazioni in sospeso o approvate",
        removeCampsiteAssignments: "Rimuovere assegnazioni piazzole",
        anonymizeHistoricalData: "Anonimizzare dati storici di utilizzo",
        deleting: "Eliminazione...",
        
        // Success messages
        success: "Successo",
        userDeletedSuccessfully: "è stato eliminato con successo."
      },
      
      bookings: {
        title: "Gestione Prenotazioni",
        subtitle: "Visualizza e gestisci tutte le prenotazioni campeggi",
        refresh: "Aggiorna",
        
        // Filter section
        filterBookings: "Filtra Prenotazioni", 
        filterByStatus: "Filtra per stato",
        allBookings: "Tutte le Prenotazioni",
        
        // Status labels
        pending: "In Sospeso",
        notice: "Avviso",
        approved: "Approvate",
        active: "Attive",
        completed: "Completate",
        cancelled: "Annullate", 
        rejected: "Rifiutate",
        
        // Table section
        bookingsTable: "Prenotazioni",
        bookingsFound: "prenotazioni trovate",
        
        // Table headers
        status: "Stato",
        id: "ID",
        customer: "Cliente",
        dates: "Date",
        actions: "Azioni",
        to: "a",
        
        // Booking actions
        approve: "Approva",
        reject: "Rifiuta",
        cancel: "Annulla",
        reactivate: "Riattiva",
        complete: "Completa",
        viewDetails: "Visualizza Dettagli",
        
        // Empty states
        errorLoadingBookings: "Errore Caricamento Prenotazioni",
        tryAgain: "Riprova",
        noBookingsFound: "Nessuna Prenotazione Trovata",
        noStatusBookings: "Non ci sono prenotazioni",
        noBookingsInSystem: "Non ci sono ancora prenotazioni nel sistema",
        
        // Expanded booking details
        customerDetails: "Dettagli Cliente",
        bookingDetails: "Dettagli Prenotazione",
        duration: "Durata",
        days: "giorni",
        campsite: "Piazzola",
        requested: "Richiesta",
        lastUpdated: "Ultimo Aggiornamento",
        total: "Totale",
        adminNotes: "Note Admin",
        noAdminNotes: "Nessuna nota admin",
        
        // Error handling
        failedToLoadBookings: "Impossibile caricare le prenotazioni. Riprova più tardi.",
        
        // Dialogs
        confirmAction: "Conferma Azione",
        confirm: "Conferma",
        processing: "Elaborazione...",
        
        // Approve dialog
        approveBooking: "Approva Prenotazione",
        bookingFor: "Prenotazione per",
        loadingCampsites: "Caricamento piazzole disponibili...",
        noCampsitesAvailable: "Nessuna Piazzola Disponibile",
        noCampsitesMessage: "Non ci sono piazzole disponibili per il periodo di prenotazione richiesto.",
        selectCampsite: "Seleziona Piazzola",
        selectCampsitePlaceholder: "Seleziona una piazzola",
        selectedCampsiteDetails: "Dettagli Piazzola Selezionata",
        deviceStatus: "Stato Dispositivo",
        currentBooking: "Prenotazione Corrente",
        ends: "Termina",
        nextAvailable: "Prossimo Disponibile",
        adminNotesOptional: "Note Admin (Opzionale)",
        adminNotesPlaceholder: "Aggiungi note su questa approvazione prenotazione",
        online: "online",
        offline: "offline",
        
        // Reject dialog
        rejectBookingRequest: "Rifiuta Richiesta Prenotazione",
        provideRejectionReason: "Fornisci un motivo per rifiutare questa richiesta di prenotazione.",
        rejectionReason: "Motivo Rifiuto",
        rejectionReasonRequired: "Motivo Rifiuto",
        rejectionReasonPlaceholder: "Inserisci motivo rifiuto...",
        rejectBooking: "Rifiuta Prenotazione",
        
        // Cancel dialog
        cancelActiveBooking: "Annulla Prenotazione Attiva", 
        provideCancellationReason: "Fornisci un motivo per annullare questa prenotazione.",
        cancellationReason: "Motivo Annullamento",
        cancellationReasonRequired: "Motivo Annullamento",
        cancellationReasonPlaceholder: "Inserisci motivo annullamento...",
        cancelBooking: "Annulla Prenotazione",
        
        // API loading and success messages
        fetchingBookings: "Recupero prenotazioni...",
        processingApproval: "Elaborazione approvazione...",
        processingRejection: "Elaborazione rifiuto...",
        processingCancellation: "Elaborazione annullamento...",
        bookingApproved: "Prenotazione approvata con successo",
        bookingRejected: "Prenotazione rifiutata con successo",
        bookingCancelled: "Prenotazione annullata con successo"
      },

      campsites: {
        title: "Gestione Piazzole",
        subtitle: "Monitora e gestisci tutte le piazzole del campeggio",
        
        // Main page
        totalCampsites: "Piazzole Totali",
        availableCampsites: "Disponibili",
        occupiedCampsites: "Occupate", 
        maintenanceCampsites: "In Manutenzione",
        refresh: "Aggiorna",
        
        // Filters and search
        allCampsites: "Tutte le Piazzole",
        searchCampsites: "Cerca piazzole...",
        searchPlaceholder: "Cerca per ID piazzola, nome...",
        
        // Table headers
        campsite: "Piazzola",
        status: "Stato",
        lastUpdated: "Ultimo Aggiornamento",
        actions: "Azioni",
        
        // Campsite info
        campsiteId: "ID Piazzola",
        campsiteName: "Nome Piazzola",
        deviceId: "ID Dispositivo",
        maintenanceReason: "Motivo Manutenzione",
        
        // Status badges
        available: "Disponibile",
        occupied: "Occupata",
        maintenance: "Manutenzione",
        unknown: "Sconosciuto",
        
        // Campsite details dialog
        campsiteDetails: "Dettagli Piazzola",
        loadingDetails: "Caricamento dettagli piazzola...",
        campsiteInformation: "Informazioni Piazzola",
        deviceInformation: "Informazioni Dispositivo",
        currentState: "Stato Corrente",
        activeBooking: "Prenotazione Attiva",
        campsiteControls: "Controlli Piazzola",
        
        // Device info
        deviceStatus: "Stato Dispositivo",
        model: "Modello",
        firmwareVersion: "Versione Firmware",
        online: "Online",
        offline: "Offline",
        
        // Current state
        electricity: "Elettricità",
        water: "Acqua",
        barrier: "Barriera",
        on: "Acceso",
        off: "Spento",
        open: "Aperto",
        closed: "Chiuso",
        
        // Booking info
        bookingId: "ID Prenotazione",
        guestName: "Nome Ospite",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guestEmail: "Email Ospite",
        bookingPeriod: "Periodo Prenotazione",
        
        // Actions
        viewDetails: "Visualizza Dettagli",
        sendCommand: "Invia Comando",
        enterMaintenance: "Entra in Manutenzione",
        exitMaintenance: "Esci da Manutenzione",
        
        // Control dialog
        sendCampsiteCommand: "Invia Comando Piazzola",
        selectUtility: "Seleziona Servizio",
        selectUtilityPlaceholder: "Scegli un servizio da controllare",
        utilities: {
          toggleElectricity: "Attiva/Disattiva Elettricità",
          toggleWater: "Attiva/Disattiva Acqua", 
          toggleBarrier: "Attiva/Disattiva Barriera"
        },
        commandReason: "Motivo Comando",
        commandReasonPlaceholder: "Inserisci motivo per questo comando...",
        commandReasonRequired: "Il motivo del comando è obbligatorio",
        sendingCommand: "Invio Comando...",
        
        // Maintenance dialog
        campsiteMaintenance: "Manutenzione Piazzola",
        enterMaintenanceMode: "Entra in Modalità Manutenzione",
        exitMaintenanceMode: "Esci da Modalità Manutenzione",
        maintenanceReasonField: "Motivo Manutenzione",
        maintenanceReasonPlaceholder: "Inserisci motivo per manutenzione...",
        maintenanceReasonRequired: "Il motivo della manutenzione è obbligatorio",
        updatingMaintenance: "Aggiornamento Manutenzione...",
        
        // Empty states
        noCampsitesFound: "Nessuna Piazzola Trovata",
        noCampsitesMessage: "Non ci sono piazzole che corrispondono ai tuoi criteri di ricerca.",
        noCampsitesInSystem: "Non ci sono ancora piazzole nel sistema.",
        noActiveBooking: "Nessuna prenotazione attiva",
        noDeviceAssigned: "Nessun dispositivo assegnato",
        
        // Error states
        error: "Errore",
        failedToLoadCampsites: "Impossibile caricare le piazzole. Riprova più tardi.",
        failedToLoadDetails: "Impossibile caricare i dettagli della piazzola. Riprova più tardi.",
        failedToSendCommand: "Impossibile inviare il comando. Riprova.",
        failedToUpdateMaintenance: "Impossibile aggiornare lo stato di manutenzione. Riprova.",
        cannotDetermineToggleState: "Impossibile determinare lo stato di attivazione: Informazioni sullo stato corrente mancanti.",
        invalidCommandType: "Tipo di comando non valido",
        
        // Success messages
        commandSent: "Comando inviato con successo",
        maintenanceUpdated: "Modalità manutenzione aggiornata",
        campsiteMaintenanceEntered: "Piazzola messa in modalità manutenzione.",
        campsiteMaintenanceExited: "Piazzola rimossa dalla modalità manutenzione.",
        
        // Format helpers
        notAvailable: "N/D",
        to: "a"
      },

      devices: {
        title: "Gestione Dispositivi",
        subtitle: "Monitora e gestisci dispositivi IoT del campeggio",
        
        // Main page
        totalDevices: "Dispositivi Totali",
        onlineDevices: "Online",
        offlineDevices: "Offline",
        maintenanceDevices: "In Manutenzione",
        refresh: "Aggiorna",
        
        // Filters and search
        allDevices: "Tutti i Dispositivi",
        filterByStatus: "Filtra per stato",
        searchDevices: "Cerca dispositivi...",
        searchPlaceholder: "Cerca per ID dispositivo, modello, tipo...",
        
        // Table headers
        device: "Dispositivo",
        status: "Stato",
        lastConnected: "Ultima Connessione",
        actions: "Azioni",
        
        // Device info
        deviceId: "ID Dispositivo",
        deviceType: "Tipo Dispositivo",
        model: "Modello",
        firmwareVersion: "Versione Firmware",
        registeredAt: "Registrato",
        uptime: "Tempo Attività",
        lastSeen: "Ultima Connessione",
        
        // Status badges
        online: "Online",
        offline: "Offline",
        maintenance: "Manutenzione", 
        unknown: "Sconosciuto",
        
        // Device details dialog
        deviceDetails: "Dettagli Dispositivo",
        loadingDetails: "Caricamento dettagli dispositivo...",
        deviceInformation: "Informazioni Dispositivo",
        assignedCampsites: "Piazzole Assegnate",
        connectionHistory: "Cronologia Connessioni",
        deviceControls: "Controlli Dispositivo",
        
        // Campsite info
        campsiteId: "ID Piazzola",
        campsiteName: "Nome Piazzola",
        campsiteStatus: "Stato Piazzola",
        currentState: "Stato Corrente",
        electricity: "Elettricità",
        water: "Acqua",
        barrier: "Barriera",
        activeBooking: "Prenotazione Attiva",
        guestName: "Nome Ospite",
        bookingPeriod: "Periodo Prenotazione",
        
        // Connection events
        connectionEvents: "Eventi Connessione",
        timestamp: "Timestamp",
        previousStatus: "Stato Precedente",
        noConnectionHistory: "Nessuna cronologia connessioni disponibile",
        
        // Device actions
        viewDetails: "Visualizza Dettagli",
        sendCommand: "Invia Comando",
        enterMaintenance: "Entra in Manutenzione",
        exitMaintenance: "Esci da Manutenzione",
        rebootDevice: "Riavvia Dispositivo",
        
        // Commands dialog
        sendDeviceCommand: "Invia Comando Dispositivo",
        selectCommand: "Seleziona Comando",
        selectCommandPlaceholder: "Scegli un tipo di comando",
        commandTypes: {
          toggle_electricity: "Attiva/Disattiva Elettricità",
          toggle_water: "Attiva/Disattiva Acqua",
          toggle_barrier: "Attiva/Disattiva Barriera",
          reboot: "Riavvia Dispositivo",
          sync_state: "Sincronizza Stato"
        },
        selectCampsite: "Seleziona Piazzola",
        selectCampsitePlaceholder: "Scegli una piazzola",
        commandReason: "Motivo Comando",
        commandReasonPlaceholder: "Inserisci motivo per questo comando...",
        commandReasonRequired: "Il motivo del comando è obbligatorio",
        sendingCommand: "Invio Comando...",
        
        // Maintenance dialog
        deviceMaintenance: "Manutenzione Dispositivo",
        enterMaintenanceMode: "Entra in Modalità Manutenzione",
        exitMaintenanceMode: "Esci da Modalità Manutenzione",
        maintenanceReason: "Motivo Manutenzione",
        maintenanceReasonPlaceholder: "Inserisci motivo per manutenzione...",
        maintenanceReasonRequired: "Il motivo della manutenzione è obbligatorio",
        updatingMaintenance: "Aggiornamento Manutenzione...",
        
        // Empty states
        noDevicesFound: "Nessun Dispositivo Trovato",
        noDevicesMessage: "Non ci sono dispositivi che corrispondono ai tuoi criteri di ricerca.",
        noDevicesInSystem: "Non ci sono ancora dispositivi nel sistema.",
        noCampsitesAssigned: "Nessuna piazzola assegnata",
        
        // Error states
        error: "Errore",
        failedToLoadDevices: "Impossibile caricare i dispositivi. Riprova più tardi.",
        failedToLoadDetails: "Impossibile caricare i dettagli del dispositivo. Riprova più tardi.",
        failedToSendCommand: "Impossibile inviare il comando. Riprova.",
        failedToUpdateMaintenance: "Impossibile aggiornare lo stato di manutenzione. Riprova.",
        
        // Success messages
        commandSent: "Comando inviato con successo",
        commandSentFor: "Comando {commandType} inviato con successo.",
        maintenanceUpdated: "Modalità manutenzione aggiornata",
        deviceMaintenanceEntered: "Dispositivo messo in modalità manutenzione.",
        deviceMaintenanceExited: "Dispositivo rimosso dalla modalità manutenzione.",
        
        // Format helpers
        notAvailable: "N/D",
        available: "Disponibile",
        occupied: "Occupata",
        on: "Acceso",
        off: "Spento",
        open: "Aperto",
        closed: "Chiuso",
        to: "a"
      },



      settings: {
        title: "Impostazioni Sistema",
        subtitle: "Configura prezzi piazzole e limiti prenotazione",
        
        // Pricing section
        pricingConfiguration: "Configurazione Prezzi Piazzola",
        pricingDescription: "Imposta i prezzi base giornalieri e i limiti di durata delle prenotazioni. Le modifiche si applicano immediatamente alle nuove prenotazioni.",
        basePrice: "Prezzo Base (al giorno)",
        basePriceDescription: "Tariffa giornaliera base per l'affitto della piazzola (in Euro €)",
        maxBookingDays: "Giorni Massimi Prenotazione",
        maxBookingDaysDescription: "Durata massima per singola prenotazione",
        minBookingDays: "Giorni Minimi Prenotazione", 
        minBookingDaysDescription: "Durata minima richiesta per prenotazione",
        
        // Form validation
        mustBePositive: "Deve essere un numero positivo",
        mustBeAtLeastOneDay: "Deve essere almeno 1 giorno",
        minCannotBeGreater: "I giorni minimi non possono essere maggiori di quelli massimi",
        
        // Actions
        saveSettings: "Salva Impostazioni",
        saving: "Salvataggio...",
        tryAgain: "Riprova",
        
        // Messages
        settingsUpdated: "Impostazioni aggiornate con successo. Le modifiche si rifletteranno immediatamente per le nuove prenotazioni.",
        failedToLoadPricing: "Impossibile caricare le impostazioni dei prezzi. Riprova più tardi.",
        failedToUpdatePricing: "Impossibile aggiornare le impostazioni dei prezzi",
        
        // Format
        days: "giorni",
        euro: "€"
      },

      analytics: {
        title: "Analitiche e Report",
        subtitle: "Visualizza statistiche e report dettagliati",
        dashboard: "Dashboard Analitiche",
        userAnalytics: "Analitiche Utenti",
        revenueAnalytics: "Analitiche Ricavi",
        usageAnalytics: "Analitiche Utilizzo",
        deviceAnalytics: "Analitiche Dispositivi",
        generateReport: "Genera Report",
        exportData: "Esporta Dati",
        dateRange: "Intervallo Date",
        lastMonth: "Ultimo Mese",
        lastYear: "Ultimo Anno",
        customRange: "Intervallo Personalizzato",
        topPerformers: "Migliori Performance",
        trends: "Tendenze",
        forecasting: "Previsioni",
        insights: "Insights",
        recommendations: "Raccomandazioni"
      }
    },

    // Home Page
    home: {
      hero: {
        badge: "Gestione Intelligente dei Campeggi",
        title: "Controlla il Tuo Campeggio a Portata di Mano",
        subtitle: "Gestisci elettricità, acqua e accessi con il nostro sistema IoT abilitato da qualsiasi luogo, in qualsiasi momento.",
        getStarted: "Inizia Ora",
        learnMore: "Scopri di Più"
      },
      features: {
        badge: "Caratteristiche Principali",
        title: "Gestione Intelligente dei Campeggi",
        subtitle: "Il nostro sistema di gestione intelligente dei campeggi offre tutto ciò di cui hai bisogno per controllare e monitorare il tuo campeggio da remoto.",
        remoteControl: {
          title: "Controllo Remoto",
          description: "Gestisci elettricità, acqua e barriere da qualsiasi luogo utilizzando la nostra interfaccia mobile o web intuitiva."
        },
        realTimeMonitoring: {
          title: "Monitoraggio in Tempo Reale",
          description: "Traccia l'utilizzo e lo stato delle utilities in tempo reale con notifiche istantanee e aggiornamenti."
        },
        smartAutomation: {
          title: "Automazione Intelligente",
          description: "Programma le operazioni delle utilities in base al tempo o alle condizioni per ottimizzare la tua esperienza in campeggio."
        },
        resourceOptimization: {
          title: "Ottimizzazione delle Risorse",
          description: "Monitora e controlla il consumo delle utilities per ridurre gli sprechi e risparmiare sulle risorse."
        },
        security: {
          title: "Sicurezza",
          description: "Garantisci un accesso sicuro al tuo campeggio con autenticazione e autorizzazione avanzate."
        },
        historicalData: {
          title: "Dati Storici",
          description: "Accedi alla cronologia d'uso e alle analitiche per comprendere meglio i tuoi modelli di consumo."
        }
      },
      howItWorks: {
        badge: "Come Funziona",
        title: "Processo di Configurazione Semplice",
        subtitle: "Iniziare con Tergucamperarea è semplice e diretto.",
        signUp: {
          title: "Registrati",
          description: "Crea un account per accedere al nostro sistema di prenotazione campeggi."
        },
        bookCampsite: {
          title: "Prenota un Campeggio",
          description: "Prenota il tuo campeggio intelligente con dispositivi IoT già installati."
        },
        controlMonitor: {
          title: "Controlla e Monitora",
          description: "Controlla e monitora il tuo campeggio dalla nostra dashboard web o app mobile."
        },
        enjoy: {
          title: "Goditi",
          description: "Goditi la comodità della gestione remota e dell'automazione intelligente."
        }
      },
      testimonials: {
        badge: "Testimonianze",
        title: "Cosa Dicono i Nostri Utenti",
        subtitle: "Ascolta dai campeggiatori che hanno trasformato la loro esperienza di campeggio con Tergucamperarea.",
        sarah: {
          name: "Sarah Johnson",
          role: "Campeggiatore del Weekend",
          quote: "Tergucamperarea ha completamente cambiato il modo in cui faccio campeggio. Essere in grado di controllare le utilities del mio campeggio dal telefone è incredibilmente conveniente!"
        },
        michael: {
          name: "Michael Chen",
          role: "Appassionato di Camper",
          quote: "La capacità di monitorare il mio consumo di acqua ed elettricità in tempo reale mi ha aiutato a diventare più consapevole delle risorse durante il campeggio."
        },
        emma: {
          name: "Emma Rodriguez",
          role: "Campeggiatore Stagionale",
          quote: "Adoro la funzione di programmazione! Posso impostare il mio campeggio per riscaldarsi prima del mio arrivo, rendendo i miei viaggi in campeggio molto più confortevoli."
        }
      },
      faq: {
        badge: "FAQ",
        title: "Domande Frequenti",
        subtitle: "Trova risposte alle domande comuni sul nostro sistema di gestione intelligente dei campeggi.",
        howItWorks: {
          question: "Come funziona il sistema di controllo del campeggio?",
          answer: "Il nostro sistema utilizza dispositivi IoT installati in ogni campeggio per controllare elettricità, acqua e barriere di accesso. Questi dispositivi si connettono alla nostra piattaforma cloud, permettendoti di controllarli da remoto tramite la nostra interfaccia web o mobile."
        },
        bookingProcess: {
          question: "Come funziona il processo di prenotazione?",
          answer: "Dopo aver creato un account, puoi prenotare un campeggio selezionando le date desiderate e inviando una richiesta di prenotazione. Una volta approvata, avrai pieno accesso per controllare le utilities del tuo campeggio da remoto."
        },
        internetConnection: {
          question: "Cosa succede se perdo la connessione internet?",
          answer: "I dispositivi IoT nel tuo campeggio continueranno a funzionare in base alle tue ultime impostazioni. Una volta ripristinata la connessione, riacquisterai il pieno controllo e tutti i dati di utilizzo verranno sincronizzati."
        },
        dataSecurity: {
          question: "I miei dati sono sicuri?",
          answer: "Sì, prendiamo la sicurezza sul serio. Tutti i dati sono criptati sia in transito che a riposo. Utilizziamo protocolli di autenticazione standard del settore e controlliamo regolarmente i nostri sistemi per vulnerabilità."
        },
        extendBooking: {
          question: "Posso estendere la mia prenotazione?",
          answer: "Sì, puoi richiedere di estendere la tua prenotazione tramite la tua dashboard. Le richieste di estensione sono soggette a disponibilità e approvazione."
        }
      },
      cta: {
        title: "Pronto a Trasformare la Tua Esperienza di Campeggio?",
        subtitle: "Unisciti a migliaia di campeggiatori che stanno godendo della comodità della gestione intelligente dei campeggi.",
        getStarted: "Inizia Oggi"
      }
    },

    // Authentication
    auth: {
      login: {
        title: "Accedi a Tergucamperarea",
        subtitle: "Inserisci la tua email e password per accedere al tuo account",
        email: "Email",
        emailPlaceholder: "la.tua.email@esempio.com",
        password: "Password",
        forgotPassword: "Password dimenticata?",
        rememberMe: "Ricordami",
        loginButton: "Accedi",
        loggingIn: "Accesso in corso...",
        noAccount: "Non hai un account?",
        registerLink: "Registrati",
        backToHome: "Torna alla home",
        hidePassword: "Nascondi password",
        showPassword: "Mostra password"
      },
      register: {
        title: "Registrati su Tergucamperarea",
        subtitle: "Crea un nuovo account per iniziare a gestire i tuoi campeggi",
        firstName: "Nome",
        lastName: "Cognome",
        email: "Email",
        password: "Password",
        confirmPassword: "Conferma Password",
        terms: "Accetto i termini e le condizioni",
        registerButton: "Registrati",
        registering: "Registrazione in corso...",
        hasAccount: "Hai già un account?",
        loginLink: "Accedi"
      },
      messages: {
        loginSuccess: "Accesso effettuato con successo",
        loginFailed: "Accesso fallito",
        registerSuccess: "Registrazione completata con successo",
        registerFailed: "Registrazione fallita",
        invalidCredentials: "Credenziali non valide",
        redirecting: "Reindirizzamento alla dashboard..."
      }
    }
  },

  en: {
    // Navigation & Common
    common: {
      home: "Home",
      dashboard: "Dashboard",
      login: "Login",
      register: "Register", 
      logout: "Logout",
      back: "Back",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      refresh: "Refresh",
      language: "Language",
      italian: "Italian",
      english: "English",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      view: "View",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
      enabled: "Enabled",
      disabled: "Disabled",
      on: "On",
      off: "Off",
      submit: "Submit",
      close: "Close",
      open: "Open",
      confirm: "Confirm",
      search: "Search",
      filter: "Filter",
      settings: "Settings",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      faq: "FAQ",
      previous: "Previous",
      next: "Next",
      goToPreviousPage: "Go to previous page",
      goToNextPage: "Go to next page",
      morePages: "More pages"
    },

    // Dashboard Navigation
    nav: {
      overview: "Overview",
      controls: "Controls",
      usage: "Usage",
      bookings: "Bookings",
      profile: "Profile",
      support: "Support",
      subscription: "Subscription",
      admin: "Admin",
      users: "Users",
      campsites: "Campsites",
      devices: "Devices",
      analytics: "Analytics"
    },

    // Dashboard
    dashboard: {
      welcome: "Welcome",
      welcomeBack: "Welcome back",
      currentBooking: "Current Booking",
      noActiveBooking: "No active booking",
      quickActions: "Quick Actions",
      recentActivity: "Recent Activity",
      systemStatus: "System Status",
      weatherInfo: "Weather Info",
      notifications: "Notifications",
      refresh: "Refresh",
      errorLoadingDashboard: "Error loading dashboard",
      retry: "Retry",
      toggleSidebar: "Toggle sidebar",
      viewProfile: "View Profile",
      
      // First booking overlay
      welcomeToTergucamperarea: "Welcome to Tergucamperarea!",
      firstBookingMessage: "To get started, you'll need to request your first campsite booking",
      noBookingsYet: "You don't have any bookings yet. Request your first booking to use our smart campsite services.",
      afterBookingApproval: "After your booking is approved, you'll be able to:",
      controlUtilities: "Control your campsite utilities remotely",
      monitorUsage: "Monitor your resource usage",
      accessFeatures: "Access all dashboard features",
      requestFirstBooking: "Request Your First Booking",
      
      // Status badges
      activeBooking: "Active Booking",
      upcomingBooking: "Upcoming Booking",
      pendingApproval: "Pending Approval",
      noBookingsFound: "No Bookings Found",
      
      // Booking details
      daysRemaining: "days remaining",
      startsIn: "Starts in",
      days: "days",
      from: "From",
      waitingForApproval: "Waiting for approval",
      bookingRequest: "Booking Request",
      campsite: "Campsite",
      
      // Device status
      deviceOnline: "Device Online",
      deviceOffline: "Device Offline",
      
      // Actions
      goToControls: "Go to Controls",
      viewBookingDetails: "View Booking Details",
      viewRequestStatus: "View Request Status",
      requestBooking: "Request Booking",
      
      // Quick controls
      quickControls: "Quick Controls",
      advancedControls: "Advanced controls",
      electricity: "Electricity",
      waterSupply: "Water Supply",
      gateBarrier: "Gate Barrier",
      readOnly: "Read Only",
      open: "OPEN",
      closed: "CLOSED",
      on: "ON",
      off: "OFF",
      
      // Page titles
      pageTitles: {
        dashboard: "Dashboard",
        myBookings: "My Bookings",
        campsiteControl: "Campsite Control",
        usageHistory: "Usage History",
        helpSupport: "Help & Support",
        profile: "Profile"
      },
      
      // Navigation
      navigation: {
        dashboard: "Dashboard",
        myBookings: "My Bookings",
        campsiteControl: "Campsite Control",
        usageHistory: "Usage History",
        helpSupport: "Help & Support"
      },
      
      overview: {
        title: "Dashboard Overview",
        subtitle: "Manage your campsite bookings and devices",
        totalBookings: "Total Bookings",
        activeDevices: "Active Devices",
        energyUsage: "Energy Usage",
        waterUsage: "Water Usage",
        lastActivity: "Last Activity",
        deviceStatus: "Device Status",
        allSystemsOperational: "All systems operational",
        someIssuesDetected: "Some issues detected",
        criticalIssuesDetected: "Critical issues detected"
      },

      controls: {
        title: "Campsite Controls",
        subtitle: "Manage utilities for your selected campsite",
        loading: "Loading controls...",
        
        // Device status
        online: "Online", 
        offline: "Offline",
        
        // No booking state
        noActiveBookingTitle: "No Active Booking",
        noActiveBookingMessage: "You need an active booking to control campsite utilities. Book a campsite to access the control panel.",
        requestBooking: "Request Booking",
        
        // Error states
        errorLoadingControls: "Error Loading Controls",
        retryLoadingProfile: "Retry Loading Profile",
        stateUpdateError: "State Update Error",
        stateUpdateErrorMessage: "Controls might not reflect the actual state.",
        
        // Utilities
        electricity: "Electricity",
        waterSupply: "Water Supply",
        gateBarrier: "Gate Barrier",
        
        // Status labels
        on: "ON",
        off: "OFF",
        open: "OPEN",
        closed: "CLOSED",
        readOnly: "Read Only",
        
        // Barrier actions
        openBarrier: "Open Barrier",
        closeBarrier: "Close Barrier",
        opening: "Opening...",
        closing: "Closing...",
        
        // Toast messages
        commandSent: "Command Sent",
        commandSuccessful: "command successful.",
        error: "Error",
        
        // Accessibility
        toggleElectricity: "Toggle Electricity",
        refreshControls: "Refresh Controls",
        openBarrierLabel: "Open Barrier",
        closeBarrierLabel: "Close Barrier",
        
        // Campsite selector
        campsiteSelector: {
          selectCampsite: "Select Campsite",
          campsite: "Campsite",
          active: "Active",
          pending: "Pending",
          expired: "Expired",
          failedToLoadCampsites: "Failed to load campsites"
        }
      },

      usage: {
        title: "Usage & History",
        subtitle: "View your electricity usage and history",
        viewingDataFor: "Viewing data for",
        
        // Summary cards
        bookingPeriod: "Booking Period",
        singleDayBooking: "Single day booking",
        deviceStatus: "Device Status",
        lastConnected: "Last connected",
        electricityUsage: "Electricity Usage",
        totalConsumptionToday: "Total consumption today",
        
        // Units and measurements
        kwh: "kWh",
        online: "ONLINE",
        offline: "OFFLINE",
        
        // History section
        commandStateHistory: "Command & State History",
        showingMostRecent: "Showing most recent commands and state changes",
        recordsOf: "of",
        records: "records",
        
        // Empty state
        noCommandHistory: "No Command History",
        noHistoryMessage: "There is no command or state change history recorded for your active booking period.",
        
        // Command descriptions
        electricityControl: "Electricity Control",
        waterControl: "Water Control",
        barrierControl: "Barrier Control",
        stateUpdate: "State Update",
        changedStateTo: "Changed state to",
        opened: "Opened",
        closed: "Closed",
        on: "ON",
        off: "OFF",
        open: "OPEN",
        electricity: "Electricity",
        water: "Water",
        barrier: "Barrier",
        stateValuesUpdated: "State values updated",
        
        // Actions
        loadMore: "Load More",
        refreshData: "Refresh data",
        source: "Source",
        
        // Error states
        error: "Error",
        noActiveBookingTitle: "No Active Booking",
        noActiveBookingMessage: "You don't have an active campsite booking for today.",
        noCampsiteAssignedTitle: "No Campsite Assigned",
        noCampsiteAssignedMessage: "Your booking doesn't have a campsite assigned yet.",
        
        // Toast messages
        noActiveBookingToast: "You don't have an active campsite booking for today.",
        noCampsiteToast: "Your booking doesn't have a campsite assigned yet.",
        errorToast: "Failed to load campsite data",
        failedToFetch: "Failed to fetch campsite data"
      },

      bookings: {
        title: "My Bookings",
        subtitle: "View and manage your campsite booking requests",
        currentBookings: "Current Bookings",
        pastBookings: "Past Bookings",
        upcomingBookings: "Upcoming Bookings",
        createBooking: "New Booking",
        requestNewBooking: "Request New Booking",
        filterByStatus: "Filter by status",
        allBookings: "All Bookings",
        bookingDetails: "Booking Details",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Guests",
        campsite: "Campsite",
        duration: "Duration",
        totalCost: "Total Cost",
        paymentStatus: "Payment Status",
        paid: "Paid",
        pending: "Pending",
        approved: "Approved",
        active: "Active",
        completed: "Completed",
        cancelled: "Cancelled",
        confirmed: "Confirmed",
        extendBooking: "Extend Booking",
        cancelBooking: "Cancel Booking",
        nights: "nights",
        bookingId: "Booking ID",
        refreshBookings: "Refresh bookings",
        
        // Table headers
        status: "Status",
        dates: "Dates",
        actions: "Actions",
        to: "to",
        viewDetails: "View Details",
        cancel: "Cancel",
        controls: "Controls",
        
        // Empty states
        noBookingsFound: "No bookings found",
        noBookingsMessage: "You haven't requested any campsite bookings yet. Create your first booking to get started.",
        noMatchingFilter: "No bookings match your current filter. Try adjusting your filter or view all bookings.",
        
        // Booking details dialog
        bookingDetailsTitle: "Booking details and information",
        bookingInformation: "Booking Information",
        paymentDetails: "Payment Details",
        adminNotes: "Admin Notes",
        requestTimeline: "Request Timeline",
        yourNotes: "Your Notes",
        
        // Booking info labels
        datesLabel: "Dates",
        daysLabel: "days",
        campsiteLabel: "Campsite",
        pendingAssignment: "Pending Assignment",
        preferred: "Preferred",
        paymentMethod: "Payment Method",
        
        // Timeline events
        bookingRequested: "Booking Requested",
        bookingApproved: "Booking Approved",
        bookingActivated: "Booking Activated",
        bookingCancelled: "Booking Cancelled",
        bookingCompleted: "Booking Completed",
        reason: "Reason",
        
        // Dialog actions
        close: "Close",
        
        // Request form dialog
        requestNewBookingTitle: "Request New Booking",
        requestFormDescription: "Fill out the form below to request a new campsite booking",
        
        // Status dialog
        bookingSuccessful: "Booking Successful",
        bookingFailed: "Booking Failed",
        errorDetails: "Error Details",
        viewMyBookings: "View My Bookings",
        tryAgain: "Try Again",
        
        // Cancel confirmation
        cancelBookingTitle: "Cancel Booking",
        cancelConfirmation: "Are you sure you want to cancel this booking? This action cannot be undone.",
        keepBooking: "Keep Booking",
        yesCancelBooking: "Yes, Cancel Booking",
        
        // Format placeholders
        invalidDate: "Invalid Date",
        notAvailable: "N/A",
        
        // Toast messages
        bookingDataRefreshed: "Booking data refreshed successfully.",
        failedToLoadBookings: "Failed to load your bookings. Please try again later.",
        bookingCancelledSuccess: "Your booking has been cancelled successfully.",
        failedToCancelBooking: "Failed to cancel booking. Please try again.",
        
        // Request form translations
        requestForm: {
          // Form sections
          dateSelection: "Date Selection",
          contactInformation: "Contact Information", 
          bookingDetails: "Booking Details",
          
          // Date fields
          checkInDate: "Check-in Date",
          checkOutDate: "Check-out Date",
          selectDate: "Select date",
          
          // Duration and dates
          duration: "Duration",
          day: "day",
          days: "days",
          maxBookingDuration: "Maximum booking duration",
          
          // Contact fields
          phoneNumber: "Phone Number",
          phoneNumberPlaceholder: "Enter your phone number",
          emailAddress: "Email Address",
          emailAddressPlaceholder: "Enter your email address",
          
          // Payment and notes
          paymentMethod: "Payment Method",
          selectPaymentMethod: "Select payment method",
          creditCard: "Credit Card",
          paypal: "PayPal",
          bankTransfer: "Bank Transfer",
          specialRequests: "Special Requests (Optional)",
          specialRequestsPlaceholder: "Any special requests or notes for your booking...",
          
          // Price summary
          pricePerDay: "Price per day",
          totalPrice: "Total Price",
          
          // Form actions
          cancel: "Cancel",
          submitBookingRequest: "Submit Booking Request",
          submitting: "Submitting...",
          
          // Error messages
          errorTitle: "Error",
          pleaseProvidePhone: "Please provide a contact phone number",
          pleaseProvideEmail: "Please provide a contact email", 
          bookingMinimumDays: "Booking must be at least 1 day",
          bookingMaximumDays: "Booking cannot exceed {maxDays} days",
          failedToCreateRequest: "Failed to create booking request. Please try again.",
          
          // Success messages
          requestSubmittedSuccess: "Your booking request has been submitted successfully. You'll be notified when it's approved.",
          failedToCreateRequestTitle: "Failed to create booking request.",
          unexpectedError: "An unexpected error occurred. Please try again later."
        }
      },

      profile: {
        title: "My Profile",
        refreshProfile: "Refresh Profile",
        
        // User Information Section
        userInformation: "User Information",
        yourAccountDetails: "Your account details",
        name: "Name",
        email: "Email",
        phoneNumber: "Phone Number",
        memberSince: "Member Since",
        
        // Booking Summary Section
        bookingSummary: "Booking Summary",
        recentUpcomingBookings: "Your recent and upcoming bookings",
        viewAllBookings: "View All Bookings",
        
        // Booking Status Labels
        active: "Active",
        approved: "Approved",
        pending: "Pending",
        completed: "Completed",
        cancelled: "Cancelled",
        
        // Booking Actions
        controlPanel: "Control Panel",
        viewDetails: "View Details",
        checkStatus: "Check Status",
        bookingRequest: "Booking Request",
        
        // Empty States
        noActiveUpcomingBookings: "No active or upcoming bookings",
        requestABooking: "Request a Booking",
        
        // Recent History
        recentBookingHistory: "Recent Booking History",
        yourPastBookings: "Your past bookings",
        total: "Total",
        bookAgain: "Book Again",
        viewAllBookingsCount: "View all {count} bookings",
        
        // Error States
        error: "Error",
        failedToLoadProfile: "Failed to load your profile. Please try again later.",
        tryAgain: "Try Again",
        
        // Format helpers
        notAvailable: "N/A"
      },

      support: {
        title: "Help & Support",
        subtitle: "Find answers to common questions or contact our support team",
        
        // Contact Support Section
        contactSupport: "Contact Support",
        waysToReach: "Ways to reach our support team for immediate assistance",
        emailSupport: "Email Support",
        responseTime24to48: "Response time: 24-48 hours",
        phoneSupport: "Phone Support",
        urgentIssuesOnly: "For urgent issues only",
        supportHours: "Support Hours",
        mondayToFriday: "Monday to Friday: 9:00 AM - 6:00 PM",
        saturday: "Saturday: 10:00 AM - 4:00 PM",
        sunday: "Sunday: Closed",
        needImmediateAssistance: "Need immediate assistance?",
        urgentIssuesCall: "For urgent issues, please call our support line directly during business hours.",
        
        // FAQ Section
        frequentlyAskedQuestions: "Frequently Asked Questions",
        findAnswersCommon: "Find answers to our most commonly asked questions",
        
        // FAQ Categories
        bookingQuestions: "Booking Questions",
        deviceControlQuestions: "Device Control Questions",
        accountQuestions: "Account Questions",
        technicalSupport: "Technical Support",
        
        // Booking Questions
        howToBookCampsite: "How do I book a campsite?",
        howToBookAnswer: "You can book a campsite by navigating to the \"My Bookings\" section and clicking on the \"Request New Booking\" button. Follow the form instructions to complete your booking.",
        cancellationPolicy: "What is the cancellation policy?",
        cancellationAnswer: "Bookings can be cancelled up to 48 hours before the start date for a full refund. Cancellations made within 48 hours of the start date may incur a cancellation fee.",
        howToExtendBooking: "How do I extend my booking?",
        extendBookingAnswer: "Active bookings can be extended through the \"My Bookings\" section. Find your active booking, click \"View Details\" and then \"Extend Stay\". Extensions are subject to availability.",
        bookingDurationLimit: "How long can I book a campsite for?",
        durationLimitAnswer: "Bookings can be made for a minimum of 1 day and a maximum of 30 days. For longer stays, please contact our support team.",
        
        // Device Control Questions
        howToControlUtilities: "How do I control my campsite utilities?",
        controlUtilitiesAnswer: "Once you have an active booking, navigate to the \"Campsite Control\" section where you'll find switches to control electricity, water, and the barrier/gate.",
        whatIfLoseConnection: "What happens if I lose internet connection?",
        loseConnectionAnswer: "The system maintains your last set states. If you lose connection, your campsite utilities will continue to operate based on your last commands until connection is restored.",
        usageLimits: "Is there a limit to how much electricity/water I can use?",
        usageLimitsAnswer: "Yes, each campsite has a daily usage limit of 100 kWh for electricity and 500 liters for water. You can monitor your usage in the \"Usage History\" section.",
        deviceOfflineWhat: "What should I do if a device appears offline?",
        deviceOfflineAnswer: "If a device shows as offline, first try refreshing the page. If it remains offline, contact our support team for assistance.",
        
        // Account Questions
        howToUpdateProfile: "How do I update my profile information?",
        updateProfileAnswer: "You can update your profile information by navigating to the \"Profile\" section in the dashboard. Click on \"Edit Profile\" to update your personal details.",
        forgotPassword: "What if I forgot my password?",
        forgotPasswordAnswer: "If you forgot your password, click on the \"Forgot Password\" link on the login page. You'll receive an email with instructions to reset your password.",
        personalDataUsage: "How is my personal data used?",
        dataUsageAnswer: "We only use your personal data to operate our services and improve your experience. We never share your data with third parties without your consent. For more details, please refer to our Privacy Policy.",
        
        // Technical Support Questions
        supportedBrowsers: "What browsers are supported?",
        browsersAnswer: "Our platform works best on the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, please keep your browser updated.",
        howToReportTechnical: "How do I report a technical issue?",
        reportTechnicalAnswer: "You can report technical issues through the contact information provided in the support section. Please provide as much detail as possible, including screenshots if applicable.",
        mobileAppAvailable: "Is the mobile app available?",
        mobileAppAnswer: "Our mobile app is currently under development. In the meantime, our website is fully responsive and works well on mobile devices.",
        systemNotResponding: "What should I do if the system is not responding?",
        systemNotRespondingAnswer: "If the system is not responding, try refreshing the page or clearing your browser cache. If the problem persists, contact our support team."
      },

      subscription: {
        title: "My Subscription",
        subtitle: "Manage your subscription plan",
        currentPlan: "Current Plan",
        planDetails: "Plan Details",
        billingHistory: "Billing History",
        paymentMethod: "Payment Method",
        nextBilling: "Next Billing",
        changePlan: "Change Plan",
        cancelSubscription: "Cancel Subscription",
        renewSubscription: "Renew Subscription",
        upgradeDowngrade: "Upgrade/Downgrade",
        planFeatures: "Plan Features",
        pricePerMonth: "Price per Month",
        pricePerYear: "Price per Year",
        basic: "Basic",
        premium: "Premium",
        pro: "Professional",
        unlimited: "Unlimited",
        features: "Features"
      }
    },

    // Admin Dashboard
    admin: {
      title: "Admin Dashboard",
      subtitle: "Manage system users, campsites and devices",
      
      // Admin Layout & Navigation
      layout: {
        toggleSidebar: "Toggle sidebar",
        tergucamperareaAdmin: "Tergucamperarea Admin",
        logout: "Logout",
        admin: "Admin",
        
        // Navigation items
        dashboard: "Dashboard",
        users: "Users", 
        bookings: "Bookings",
        campsites: "Campsites",
        devices: "Devices",
        settings: "Settings",
        
        // Page titles
        pageTitles: {
          adminDashboard: "Admin Dashboard",
          userManagement: "User Management",
          bookingManagement: "Booking Management", 
          campsiteManagement: "Campsite Management",
          deviceManagement: "Device Management",
          systemSettings: "System Settings",
          systemHealth: "System Health"
        }
      },
      
      overview: {
        title: "System Overview",
        subtitle: "Real-time monitoring and management",
        lastUpdated: "Last updated",
        refresh: "Refresh",
        retry: "Retry",
        
        // Error states
        errorLoadingDashboard: "Error Loading Dashboard",
        errorLoadingData: "Failed to load dashboard data. Please try again later.",
        errorLoadingAnalytics: "Failed to load analytics data. Please try again later.",
        failedToFetchDashboard: "Failed to fetch dashboard data",
        failedToFetchHealth: "Failed to fetch system health data",
        failedToFetchAnalytics: "Failed to fetch analytics data",
        
        // Main stats cards
        totalUsers: "Total Users",
        totalDevices: "Total Devices",
        totalCampsites: "Total Campsites",
        activeBookings: "Active Bookings",
        
        // Status labels
        admins: "admins",
        users: "users",
        online: "online",
        offline: "offline",
        available: "available",
        occupied: "occupied",
        pending: "pending",
        completed: "completed",
        
        // System health section
        systemHealth: "System Health",
        environment: "Environment",
        region: "Region",
        unknown: "Unknown",
        healthScore: "Health Score",
        healthy: "Healthy",
        degraded: "Degraded",
        unhealthy: "Unhealthy",
        notConfigured: "Not Configured",
        
        // Health details
        overallStatus: "Overall Status",
        databaseConnections: "Database Connections",
        externalServices: "External Services",
        systemComponents: "System Components",
        statistics: "Statistics",
        
        // Statistics breakdown
        devices: "Devices",
        campsites: "Campsites",
        bookings: "Bookings",
        commands24h: "Commands (24h)",
        maintenance: "Maintenance",
        active: "Active",
        approved: "Approved",
        success: "Success",
        failed: "Failed",
        successRate: "Success Rate",
        
        // Runtime information
        runtimeInformation: "Runtime Information",
        nodejsVersion: "Node.js Version",
        memoryLimit: "Memory Limit",
        lambdaFunction: "Lambda Function",
        
        // Pending approvals section
        pendingApprovals: "Pending Approvals",
        newPending: "new",
        bookingsRequiringAttention: "Bookings requiring immediate attention",
        review: "Review",
        viewAllPending: "View All Pending",
        
        // General
        total: "Total",
        arrowUpRight: "Go to",
        loading: "Loading...",
        noData: "No data available"
      },

      users: {
        title: "User Management",
        subtitle: "View and manage system users",
        refresh: "Refresh",
        
        // Statistics
        totalUsers: "Total Users",
        adminUsers: "Admin Users",
        regularUsers: "Regular Users",
        
        // Table and filters
        systemUsers: "System Users",
        filterByRole: "Filter by role",
        allRoles: "All Roles",
        admin: "Admin",
        regularUser: "Regular User",
        searchByEmail: "Search by email...",
        
        // Table headers
        user: "User",
        role: "Role",
        registered: "Registered",
        actions: "Actions",
        viewDetails: "View Details",
        deleteUser: "Delete User",
        
        // Empty states
        noUsersFound: "No Users Found",
        noUsersMatch: "No users match your search criteria. Try adjusting your filters.",
        noUsersInSystem: "There are no users in the system yet.",
        
        // Error states
        error: "Error",
        failedToFetchUsers: "Failed to fetch users",
        failedToLoadUsers: "Failed to load users. Please try again later.",
        failedToFetchUserDetails: "Failed to fetch user details",
        failedToLoadUserDetails: "Failed to load user details. Please try again later.",
        failedToDeleteUser: "Failed to delete user",
        
        // User details
        userDetails: "User Details",
        accountInformation: "Account Information",
        userId: "User ID",
        emailAddress: "Email Address",
        registrationDate: "Registration Date",
        
        // Campsites section
        assignedCampsites: "Assigned Campsites",
        campsiteId: "Campsite ID",
        status: "Status",
        assignedDate: "Assigned Date", 
        expiryDate: "Expiry Date",
        active: "Active",
        expired: "Expired",
        inactive: "Inactive",
        
        // Subscription requests
        subscriptionRequests: "Subscription Requests",
        requestDate: "Request Date",
        type: "Type",
        approved: "Approved",
        rejected: "Rejected",
        pending: "Pending",
        
        // Delete confirmation
        deleteUserAccount: "Delete User Account",
        deleteConfirmation: "Are you sure you want to permanently delete the user account for",
        actionCannotBeUndone: "This action cannot be undone and will:",
        deleteAccountPermanently: "Permanently delete the user account",
        cancelPendingBookings: "Cancel any pending or approved bookings",
        removeCampsiteAssignments: "Remove campsite assignments",
        anonymizeHistoricalData: "Anonymize historical usage data",
        deleting: "Deleting...",
        
        // Success messages
        success: "Success",
        userDeletedSuccessfully: "has been deleted successfully."
      },

            campsites: {
        title: "Campsite Management",
        subtitle: "Monitor and manage all campsite locations",
        
        // Main page
        totalCampsites: "Total Campsites",
        availableCampsites: "Available",
        occupiedCampsites: "Occupied", 
        maintenanceCampsites: "In Maintenance",
        refresh: "Refresh",
        
        // Filters and search
        allCampsites: "All Campsites",
        searchCampsites: "Search campsites...",
        searchPlaceholder: "Search by campsite ID, name...",
        
        // Table headers
        campsite: "Campsite",
        status: "Status",
        lastUpdated: "Last Updated",
        actions: "Actions",
        
        // Campsite info
        campsiteId: "Campsite ID",
        campsiteName: "Campsite Name",
        deviceId: "Device ID",
        maintenanceReason: "Maintenance Reason",
        
        // Status badges
        available: "Available",
        occupied: "Occupied",
        maintenance: "Maintenance",
        unknown: "Unknown",
        
        // Campsite details dialog
        campsiteDetails: "Campsite Details",
        loadingDetails: "Loading campsite details...",
        campsiteInformation: "Campsite Information",
        deviceInformation: "Device Information",
        currentState: "Current State",
        activeBooking: "Active Booking",
        campsiteControls: "Campsite Controls",
        
        // Device info
        deviceStatus: "Device Status",
        model: "Model",
        firmwareVersion: "Firmware Version",
        online: "Online",
        offline: "Offline",
        
        // Current state
        electricity: "Electricity",
        water: "Water",
        barrier: "Barrier",
        on: "On",
        off: "Off",
        open: "Open",
        closed: "Closed",
        
        // Booking info
        bookingId: "Booking ID",
        guestName: "Guest Name",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guestEmail: "Guest Email",
        bookingPeriod: "Booking Period",
        
        // Actions
        viewDetails: "View Details",
        sendCommand: "Send Command",
        enterMaintenance: "Enter Maintenance",
        exitMaintenance: "Exit Maintenance",
        
        // Control dialog
        sendCampsiteCommand: "Send Campsite Command",
        selectUtility: "Select Utility",
        selectUtilityPlaceholder: "Choose a utility to control",
        utilities: {
          toggleElectricity: "Toggle Electricity",
          toggleWater: "Toggle Water", 
          toggleBarrier: "Toggle Barrier"
        },
        commandReason: "Command Reason",
        commandReasonPlaceholder: "Enter reason for this command...",
        commandReasonRequired: "Command reason is required",
        sendingCommand: "Sending Command...",
        
        // Maintenance dialog
        campsiteMaintenance: "Campsite Maintenance",
        enterMaintenanceMode: "Enter Maintenance Mode",
        exitMaintenanceMode: "Exit Maintenance Mode",
        maintenanceReasonField: "Maintenance Reason",
        maintenanceReasonPlaceholder: "Enter reason for maintenance...",
        maintenanceReasonRequired: "Maintenance reason is required",
        updatingMaintenance: "Updating Maintenance...",
        
        // Empty states
        noCampsitesFound: "No Campsites Found",
        noCampsitesMessage: "There are no campsites matching your search criteria.",
        noCampsitesInSystem: "There are no campsites in the system yet.",
        noActiveBooking: "No active booking",
        noDeviceAssigned: "No device assigned",
        
        // Error states
        error: "Error",
        failedToLoadCampsites: "Failed to load campsites. Please try again later.",
        failedToLoadDetails: "Failed to load campsite details. Please try again later.",
        failedToSendCommand: "Failed to send command. Please try again.",
        failedToUpdateMaintenance: "Failed to update maintenance status. Please try again.",
        cannotDetermineToggleState: "Cannot determine toggle state: Current state information is missing.",
        invalidCommandType: "Invalid command type",
        
        // Success messages
        commandSent: "Command sent successfully",
        maintenanceUpdated: "Maintenance mode updated",
        campsiteMaintenanceEntered: "Campsite placed in maintenance mode.",
        campsiteMaintenanceExited: "Campsite removed from maintenance mode.",
        
        // Format helpers
        notAvailable: "N/A",
        to: "to"
      },

      devices: {
        title: "Device Management",
        subtitle: "Monitor and manage campsite IoT devices",
        
        // Main page
        totalDevices: "Total Devices",
        onlineDevices: "Online",
        offlineDevices: "Offline",
        maintenanceDevices: "In Maintenance",
        refresh: "Refresh",
        
        // Filters and search
        allDevices: "All Devices",
        filterByStatus: "Filter by status",
        searchDevices: "Search devices...",
        searchPlaceholder: "Search by device ID, model, type...",
        
        // Table headers
        device: "Device",
        status: "Status",
        lastConnected: "Last Connected",
        actions: "Actions",
        
        // Device info
        deviceId: "Device ID",
        deviceType: "Device Type",
        model: "Model",
        firmwareVersion: "Firmware Version",
        registeredAt: "Registered",
        uptime: "Uptime",
        lastSeen: "Last Seen",
        
        // Status badges
        online: "Online",
        offline: "Offline",
        maintenance: "Maintenance",
        unknown: "Unknown",
        
        // Device details dialog
        deviceDetails: "Device Details",
        loadingDetails: "Loading device details...",
        deviceInformation: "Device Information",
        assignedCampsites: "Assigned Campsites",
        connectionHistory: "Connection History",
        deviceControls: "Device Controls",
        
        // Campsite info
        campsiteId: "Campsite ID",
        campsiteName: "Campsite Name",
        campsiteStatus: "Campsite Status",
        currentState: "Current State",
        electricity: "Electricity",
        water: "Water",
        barrier: "Barrier",
        activeBooking: "Active Booking",
        guestName: "Guest Name",
        bookingPeriod: "Booking Period",
        
        // Connection events
        connectionEvents: "Connection Events",
        timestamp: "Timestamp",
        previousStatus: "Previous Status",
        noConnectionHistory: "No connection history available",
        
        // Device actions
        viewDetails: "View Details",
        sendCommand: "Send Command",
        enterMaintenance: "Enter Maintenance",
        exitMaintenance: "Exit Maintenance",
        rebootDevice: "Reboot Device",
        
        // Commands dialog
        sendDeviceCommand: "Send Device Command",
        selectCommand: "Select Command",
        selectCommandPlaceholder: "Choose a command type",
        commandTypes: {
          toggle_electricity: "Toggle Electricity",
          toggle_water: "Toggle Water",
          toggle_barrier: "Toggle Barrier",
          reboot: "Reboot Device",
          sync_state: "Sync State"
        },
        selectCampsite: "Select Campsite",
        selectCampsitePlaceholder: "Choose a campsite",
        commandReason: "Command Reason",
        commandReasonPlaceholder: "Enter reason for this command...",
        commandReasonRequired: "Command reason is required",
        sendingCommand: "Sending Command...",
        
        // Maintenance dialog
        deviceMaintenance: "Device Maintenance",
        enterMaintenanceMode: "Enter Maintenance Mode",
        exitMaintenanceMode: "Exit Maintenance Mode",
        maintenanceReason: "Maintenance Reason",
        maintenanceReasonPlaceholder: "Enter reason for maintenance...",
        maintenanceReasonRequired: "Maintenance reason is required",
        updatingMaintenance: "Updating Maintenance...",
        
        // Empty states
        noDevicesFound: "No Devices Found",
        noDevicesMessage: "There are no devices matching your search criteria.",
        noDevicesInSystem: "There are no devices in the system yet.",
        noCampsitesAssigned: "No campsites assigned",
        
        // Error states
        error: "Error",
        failedToLoadDevices: "Failed to load devices. Please try again later.",
        failedToLoadDetails: "Failed to load device details. Please try again later.",
        failedToSendCommand: "Failed to send command. Please try again.",
        failedToUpdateMaintenance: "Failed to update maintenance status. Please try again.",
        
        // Success messages
        commandSent: "Command sent successfully",
        commandSentFor: "Command {commandType} sent successfully.",
        maintenanceUpdated: "Maintenance mode updated",
        deviceMaintenanceEntered: "Device placed in maintenance mode.",
        deviceMaintenanceExited: "Device removed from maintenance mode.",
        
        // Format helpers
        notAvailable: "N/A",
        available: "Available",
        occupied: "Occupied",
        on: "On",
        off: "Off",
        open: "Open",
        closed: "Closed",
        to: "to"
      },

      bookings: {
        title: "Booking Management",
        subtitle: "View and manage all campsite bookings",
        refresh: "Refresh",
        
        // Filter section
        filterBookings: "Filter Bookings", 
        filterByStatus: "Filter by status",
        allBookings: "All Bookings",
        
        // Status labels
        pending: "Pending",
        notice: "Notice",
        approved: "Approved",
        active: "Active",
        completed: "Completed",
        cancelled: "Cancelled", 
        rejected: "Rejected",
        
        // Table section
        bookingsTable: "Bookings",
        bookingsFound: "bookings found",
        
        // Table headers
        status: "Status",
        id: "ID",
        customer: "Customer",
        dates: "Dates",
        actions: "Actions",
        to: "to",
        
        // Booking actions
        approve: "Approve",
        reject: "Reject",
        cancel: "Cancel",
        reactivate: "Reactivate",
        complete: "Complete",
        viewDetails: "View Details",
        
        // Empty states
        errorLoadingBookings: "Error Loading Bookings",
        tryAgain: "Try Again",
        noBookingsFound: "No Bookings Found",
        noStatusBookings: "No bookings found",
        noBookingsInSystem: "There are no bookings in the system yet",
        
        // Expanded booking details
        customerDetails: "Customer Details",
        bookingDetails: "Booking Details",
        duration: "Duration",
        days: "days",
        campsite: "Campsite",
        requested: "Requested",
        lastUpdated: "Last Updated",
        total: "Total",
        adminNotes: "Admin Notes",
        noAdminNotes: "No admin notes",
        
        // Error handling
        failedToLoadBookings: "Failed to load bookings. Please try again later.",
        
        // Dialogs
        confirmAction: "Confirm Action",
        confirm: "Confirm",
        processing: "Processing...",
        
        // Approve dialog
        approveBooking: "Approve Booking",
        bookingFor: "Booking for",
        loadingCampsites: "Loading available campsites...",
        noCampsitesAvailable: "No Campsites Available",
        noCampsitesMessage: "There are no available campsites for the requested booking period.",
        selectCampsite: "Select Campsite",
        selectCampsitePlaceholder: "Select a campsite",
        selectedCampsiteDetails: "Selected Campsite Details",
        deviceStatus: "Device Status",
        currentBooking: "Current Booking",
        ends: "Ends",
        nextAvailable: "Next Available",
        adminNotesOptional: "Admin Notes (Optional)",
        adminNotesPlaceholder: "Add any notes about this booking approval",
        online: "online",
        offline: "offline",
        
        // Reject dialog
        rejectBookingRequest: "Reject Booking Request",
        provideRejectionReason: "Please provide a reason for rejecting this booking request.",
        rejectionReason: "Rejection Reason",
        rejectionReasonRequired: "Rejection Reason",
        rejectionReasonPlaceholder: "Enter rejection reason...",
        rejectBooking: "Reject Booking",
        
        // Cancel dialog
        cancelActiveBooking: "Cancel Active Booking", 
        provideCancellationReason: "Please provide a reason for cancelling this booking.",
        cancellationReason: "Cancellation Reason",
        cancellationReasonRequired: "Cancellation Reason",
        cancellationReasonPlaceholder: "Enter cancellation reason...",
        cancelBooking: "Cancel Booking",
        
        // API loading and success messages
        fetchingBookings: "Fetching bookings...",
        processingApproval: "Processing approval...",
        processingRejection: "Processing rejection...",
        processingCancellation: "Processing cancellation...",
        bookingApproved: "Booking approved successfully",
        bookingRejected: "Booking rejected successfully",
        bookingCancelled: "Booking cancelled successfully"
      },

      settings: {
        title: "System Settings",
        subtitle: "Configure campsite pricing and booking duration limits",
        
        // Pricing section
        pricingConfiguration: "Campsite Pricing Configuration",
        pricingDescription: "Set base daily prices and booking duration limits. Changes apply immediately to new bookings.",
        basePrice: "Base Price (per day)",
        basePriceDescription: "Base daily charge for campsite rental (in Euro €)",
        maxBookingDays: "Maximum Booking Days",
        maxBookingDaysDescription: "Maximum duration for single booking",
        minBookingDays: "Minimum Booking Days",
        minBookingDaysDescription: "Minimum duration required for booking",
        
        // Form validation
        mustBePositive: "Must be a positive number",
        mustBeAtLeastOneDay: "Must be at least 1 day",
        minCannotBeGreater: "Minimum booking days cannot be greater than maximum booking days",
        
        // Actions
        saveSettings: "Save Settings",
        saving: "Saving...",
        tryAgain: "Try Again",
        
        // Messages
        settingsUpdated: "Pricing settings updated successfully. Changes will be reflected immediately for new bookings.",
        failedToLoadPricing: "Failed to load pricing settings. Please try again later.",
        failedToUpdatePricing: "Failed to update pricing settings",
        
        // Format
        days: "days",
        euro: "€"
      },

      analytics: {
        title: "Analytics & Reports",
        subtitle: "View detailed statistics and reports",
        dashboard: "Analytics Dashboard",
        userAnalytics: "User Analytics",
        revenueAnalytics: "Revenue Analytics",
        usageAnalytics: "Usage Analytics",
        deviceAnalytics: "Device Analytics",
        generateReport: "Generate Report",
        exportData: "Export Data",
        dateRange: "Date Range",
        lastMonth: "Last Month",
        lastYear: "Last Year",
        customRange: "Custom Range",
        topPerformers: "Top Performers",
        trends: "Trends",
        forecasting: "Forecasting",
        insights: "Insights",
        recommendations: "Recommendations"
      }
    },

    // Home Page
    home: {
      hero: {
        badge: "Smart Campsite Management",
        title: "Control Your Campsite at Your Fingertips",
        subtitle: "Manage electricity, water, and access with our IoT-enabled system from anywhere, anytime.",
        getStarted: "Get Started",
        learnMore: "Learn More"
      },
      features: {
        badge: "Key Features",
        title: "Smart Campsite Management",
        subtitle: "Our smart campsite management system offers everything you need to control and monitor your campsite remotely.",
        remoteControl: {
          title: "Remote Control",
          description: "Manage electricity, water, and barriers from anywhere using our intuitive mobile or web interface."
        },
        realTimeMonitoring: {
          title: "Real-Time Monitoring",
          description: "Track utility usage and status in real-time with instant notifications and updates."
        },
        smartAutomation: {
          title: "Smart Automation",
          description: "Schedule utility operations based on time or conditions to optimize your campsite experience."
        },
        resourceOptimization: {
          title: "Resource Optimization",
          description: "Monitor and control utility consumption to reduce waste and save on resources."
        },
        security: {
          title: "Security",
          description: "Ensure secure access to your campsite with advanced authentication and authorization."
        },
        historicalData: {
          title: "Historical Data",
          description: "Access usage history and analytics to better understand your consumption patterns."
        }
      },
      howItWorks: {
        badge: "How It Works",
        title: "Simple Setup Process",
        subtitle: "Getting started with Tergucamperarea is simple and straightforward.",
        signUp: {
          title: "Sign Up",
          description: "Create an account to access our campsite booking system."
        },
        bookCampsite: {
          title: "Book a Campsite",
          description: "Book your smart-enabled campsite with IoT devices already installed."
        },
        controlMonitor: {
          title: "Control & Monitor",
          description: "Control and monitor your campsite from our web dashboard or mobile app."
        },
        enjoy: {
          title: "Enjoy",
          description: "Enjoy the convenience of remote management and smart automation."
        }
      },
      testimonials: {
        badge: "Testimonials",
        title: "What Our Users Say",
        subtitle: "Hear from campers who have transformed their camping experience with Tergucamperarea.",
        sarah: {
          name: "Sarah Johnson",
          role: "Weekend Camper",
          quote: "Tergucamperarea has completely changed how I camp. Being able to control my campsite utilities from my phone is incredibly convenient!"
        },
        michael: {
          name: "Michael Chen",
          role: "RV Enthusiast",
          quote: "The ability to monitor my water and electricity usage in real-time has helped me become more resource-conscious while camping."
        },
        emma: {
          name: "Emma Rodriguez",
          role: "Seasonal Camper",
          quote: "I love the scheduling feature! I can set my campsite to warm up before I arrive, making my camping trips much more comfortable."
        }
      },
      faq: {
        badge: "FAQ",
        title: "Frequently Asked Questions",
        subtitle: "Find answers to common questions about our smart campsite management system.",
        howItWorks: {
          question: "How does the campsite control system work?",
          answer: "Our system uses IoT devices installed at each campsite to control electricity, water, and access barriers. These devices connect to our cloud platform, allowing you to control them remotely through our web or mobile interface."
        },
        bookingProcess: {
          question: "How does the booking process work?",
          answer: "After creating an account, you can book a campsite by selecting your desired dates and submitting a booking request. Once approved, you'll have full access to control your campsite's utilities remotely."
        },
        internetConnection: {
          question: "What happens if I lose internet connection?",
          answer: "The IoT devices at your campsite will continue to operate based on your last settings. Once your connection is restored, you'll regain full control and any usage data will be synchronized."
        },
        dataSecurity: {
          question: "Is my data secure?",
          answer: "Yes, we take security seriously. All data is encrypted both in transit and at rest. We use industry-standard authentication protocols and regularly audit our systems for vulnerabilities."
        },
        extendBooking: {
          question: "Can I extend my booking?",
          answer: "Yes, you can request to extend your booking through your dashboard. Extension requests are subject to availability and approval."
        }
      },
      cta: {
        title: "Ready to Transform Your Camping Experience?",
        subtitle: "Join thousands of campers who are enjoying the convenience of smart campsite management.",
        getStarted: "Get Started Today"
      }
    },

    // Authentication  
    auth: {
      login: {
        title: "Login to Tergucamperarea",
        subtitle: "Enter your email and password to access your account",
        email: "Email",
        emailPlaceholder: "your.email@example.com",
        password: "Password",
        forgotPassword: "Forgot password?",
        rememberMe: "Remember me",
        loginButton: "Login",
        loggingIn: "Logging in...",
        noAccount: "Don't have an account?",
        registerLink: "Register",
        backToHome: "Back to home",
        hidePassword: "Hide password",
        showPassword: "Show password"
      },
      register: {
        title: "Register to Tergucamperarea",
        subtitle: "Create a new account to start managing your campsites",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        terms: "I agree to the terms and conditions",
        registerButton: "Register",
        registering: "Registering...",
        hasAccount: "Already have an account?",
        loginLink: "Login"
      },
      messages: {
        loginSuccess: "Login successful",
        loginFailed: "Login failed",
        registerSuccess: "Registration successful",
        registerFailed: "Registration failed",
        invalidCredentials: "Invalid credentials",
        redirecting: "Redirecting to dashboard..."
      }
    }
  }
}

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('it') // Italian as default

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['it', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    // Return the translation, fallback, or key itself
    return value || fallback || key
  }

  const switchLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    // Force re-render of the entire app
    window.location.reload()
  }

  return { 
    t, 
    language, 
    switchLanguage,
    isItalian: language === 'it',
    isEnglish: language === 'en'
  }
}

export { translations }
export default useTranslation
