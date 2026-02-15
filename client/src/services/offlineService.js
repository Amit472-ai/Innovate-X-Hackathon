import axios from 'axios';

class OfflineService {
    constructor() {
        this.data = null;
        this.isLoading = false;
        this.error = null;
    }

    async loadData() {
        if (this.data) return;

        this.isLoading = true;
        try {
            // Fetch from the public directory
            const response = await axios.get('/offline_data.json');
            this.data = response.data;
            console.log('Offline data loaded:', this.data.length, 'conditions');
        } catch (err) {
            console.error('Failed to load offline data:', err);
            this.error = err;
        } finally {
            this.isLoading = false;
        }
    }

    async analyzeSymptoms(symptoms) {
        if (!this.data) {
            await this.loadData();
        }

        if (!this.data || this.data.length === 0) {
            return {
                results: [],
                disclaimer: "Offline mode active. No data available.",
                error: "Offline data not loaded."
            };
        }

        const userSymptoms = symptoms.map(s => s.toLowerCase());

        // Filter conditions based on keyword matching
        const matchedConditions = this.data.filter(condition => {
            // Check if any of the condition's symptoms match the user's symptoms
            // The condition.symptoms array contains strings. 
            // We'll check if any user symptom string is a substring of a condition symptom, or vice versa
            return condition.symptoms.some(condSym =>
                userSymptoms.some(userSym =>
                    condSym.toLowerCase().includes(userSym) || userSym.includes(condSym.toLowerCase())
                )
            );
        });

        // Format results to match the server response structure
        const formattedResults = matchedConditions.map(cond => ({
            condition: cond.name,
            condition_hi: cond.name_hi,
            severity: cond.severity,
            severity_hi: cond.severity_hi,
            description: cond.description, // simplifiedDescription from export
            description_hi: cond.description_hi,
            advice: cond.advice,
            advice_hi: cond.advice_hi,
            matchParams: cond.symptoms.filter(s =>
                userSymptoms.some(userSym => s.toLowerCase().includes(userSym.toLowerCase()))
            )
        }));

        // Limit to top 3 matches (naive ranking by number of matches could be added here)
        return {
            results: formattedResults.slice(0, 3)
        };
    }
}

export default new OfflineService();
