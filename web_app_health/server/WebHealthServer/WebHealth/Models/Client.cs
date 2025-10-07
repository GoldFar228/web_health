namespace WebHealth.Models
{
    public class Client
    {
        public int Id { get; set; }
        public required string LastName { get; set; }
        public required string FirstName { get; set; }
        public required string MidName { get; set; }
        public required DateOnly BirthDate{ get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public string? HealthIssues { get; set; }
        public string? Height { get; set; }
        public string? Weight { get; set; }

        // Дописать FK для CoachId

    }
}
