// Privacy API integration functions
export interface PrivacyCheckRequest {
    input: string;
  }
  
  export interface PrivacyCheckResponse {
    response: string;
    hasSensitiveInfo: boolean;
    sensitiveCategories?: string[];
    confidence?: number;
  }
  
  export class PrivacyAPI {
    private baseUrl: string;
  
    constructor(baseUrl: string = 'http://localhost:8000') {
      this.baseUrl = baseUrl;
    }
  
    async checkPrivacy(input: string): Promise<PrivacyCheckResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/api/privacy-check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Privacy API error:', error);
        throw error;
      }
    }
  
    async getPrivacyStatus(): Promise<{ status: string; version: string }> {
      try {
        const response = await fetch(`${this.baseUrl}/api/status`);
        return await response.json();
      } catch (error) {
        console.error('Privacy API status error:', error);
        throw error;
      }
    }
  }
  
  export const privacyAPI = new PrivacyAPI();