const CONFIG = {
    openai: {
        defaultModel: 'gpt-4', // or 'gpt-3.5-turbo'
        models: [
            {
                id: 'gpt-4',
                name: 'GPT-4',
                description: 'Most powerful, best for comprehensive keyword analysis'
            },
            {
                id: 'gpt-3.5-turbo',
                name: 'GPT-3.5 Turbo',
                description: 'Faster, good for quick keyword generation'
            }
        ]
    },
    ui: {
        theme: {
            primary: 'indigo',
            secondary: 'gray',
            accent: 'green'
        },
        animation: {
            duration: '0.3s',
            type: 'ease-in-out'
        }
    }
};
