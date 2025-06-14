
export class EmailUtils {
    static validateEmail(email: string): string {
        if (!email || email === "Not provided") return "Not provided";
        
        // Strict email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (emailRegex.test(email.trim())) {
            return email.trim();
        }
        
        return "Not provided";
    }
}
