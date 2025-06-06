package utils

import (
	"encoding/json"
	"log"
	"time"

	"github.com/smhnaqvi/cveeker/models"
	"gorm.io/gorm"
)

// SeedDatabase populates the database with sample data
func SeedDatabase(db *gorm.DB) error {
	log.Println("Seeding database with sample data...")

	// Sample users
	users := []models.User{
		{
			Name:       "John Doe",
			Email:      "john.doe@example.com",
			Phone:      "+1234567890",
			Summary:    "Experienced Software Developer",
			Education:  "BS Computer Science",
			Experience: "5 years in web development",
			Skills:     "Go, JavaScript, React, Python",
			Languages:  "English, Spanish",
			Step:       "completed",
		},
		{
			Name:       "Jane Smith",
			Email:      "jane.smith@example.com",
			Phone:      "+1987654321",
			Summary:    "Full Stack Developer and Tech Lead",
			Education:  "MS Software Engineering",
			Experience: "7 years in full-stack development",
			Skills:     "Java, Spring, Angular, Docker",
			Languages:  "English, French",
			Step:       "completed",
		},
		{
			Name:       "Mike Johnson",
			Email:      "mike.johnson@example.com",
			Phone:      "+1555123456",
			Summary:    "DevOps Engineer",
			Education:  "BS Information Technology",
			Experience: "4 years in DevOps and Cloud",
			Skills:     "AWS, Kubernetes, Terraform, Jenkins",
			Languages:  "English",
			Step:       "completed",
		},
	}

	// Create users
	for _, user := range users {
		var existingUser models.User
		if err := db.Where("email = ?", user.Email).First(&existingUser).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&user).Error; err != nil {
				return err
			}
			log.Printf("Created user: %s", user.Name)
		}
	}

	// Sample work experience
	workExp1, _ := json.Marshal([]models.WorkExperience{
		{
			Company:      "Tech Corp",
			Position:     "Senior Software Developer",
			Location:     "San Francisco, CA",
			StartDate:    time.Date(2021, 1, 1, 0, 0, 0, 0, time.UTC),
			EndDate:      nil,
			IsCurrent:    true,
			Description:  "Led development of microservices architecture using Go and Docker. Managed team of 4 developers.",
			Technologies: []string{"Go", "Docker", "Kubernetes", "PostgreSQL"},
		},
		{
			Company:      "StartupXYZ",
			Position:     "Full Stack Developer",
			Location:     "New York, NY",
			StartDate:    time.Date(2019, 6, 1, 0, 0, 0, 0, time.UTC),
			EndDate:      &[]time.Time{time.Date(2020, 12, 31, 0, 0, 0, 0, time.UTC)}[0],
			IsCurrent:    false,
			Description:  "Developed web applications using React and Node.js. Implemented CI/CD pipelines.",
			Technologies: []string{"React", "Node.js", "MongoDB", "AWS"},
		},
	})

	// Sample education
	education1, _ := json.Marshal([]models.Education{
		{
			Institution:  "University of Technology",
			Degree:       "Bachelor of Science",
			FieldOfStudy: "Computer Science",
			Location:     "Boston, MA",
			StartDate:    time.Date(2015, 9, 1, 0, 0, 0, 0, time.UTC),
			EndDate:      &[]time.Time{time.Date(2019, 5, 31, 0, 0, 0, 0, time.UTC)}[0],
			GPA:          "3.8/4.0",
			Description:  "Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Software Engineering.",
		},
	})

	// Sample skills
	skills1, _ := json.Marshal([]models.Skill{
		{Name: "Go", Category: "Programming Languages", Level: 5, YearsExp: 3},
		{Name: "JavaScript", Category: "Programming Languages", Level: 4, YearsExp: 5},
		{Name: "React", Category: "Frontend", Level: 4, YearsExp: 3},
		{Name: "Docker", Category: "DevOps", Level: 4, YearsExp: 2},
		{Name: "Leadership", Category: "Soft Skills", Level: 4, YearsExp: 2},
	})

	// Sample languages
	languages1, _ := json.Marshal([]models.Language{
		{Name: "English", Proficiency: "Native"},
		{Name: "Spanish", Proficiency: "Conversational"},
	})

	// Get the first user for sample resumes
	var firstUser models.User
	if err := db.First(&firstUser).Error; err != nil {
		return err
	}

	// Sample resumes
	resumes := []models.Resume{
		{
			UserID:     firstUser.ID,
			Title:      "Software Developer - Tech Companies",
			IsActive:   true,
			FullName:   firstUser.Name,
			Email:      firstUser.Email,
			Phone:      firstUser.Phone,
			Address:    "123 Tech Street, San Francisco, CA 94105",
			Website:    "https://johndoe.dev",
			LinkedIn:   "https://linkedin.com/in/johndoe",
			GitHub:     "https://github.com/johndoe",
			Summary:    "Passionate software developer with 5+ years of experience building scalable web applications and leading development teams.",
			Objective:  "Seeking a senior software developer role where I can leverage my technical expertise and leadership skills.",
			Experience: string(workExp1),
			Education:  string(education1),
			Skills:     string(skills1),
			Languages:  string(languages1),
			Template:   "modern",
			Theme:      "blue",
		},
		{
			UserID:     firstUser.ID,
			Title:      "Full Stack Developer - Startups",
			IsActive:   false,
			FullName:   firstUser.Name,
			Email:      firstUser.Email,
			Phone:      firstUser.Phone,
			Address:    "123 Tech Street, San Francisco, CA 94105",
			Website:    "https://johndoe.dev",
			LinkedIn:   "https://linkedin.com/in/johndoe",
			GitHub:     "https://github.com/johndoe",
			Summary:    "Dynamic full-stack developer with startup experience and passion for building innovative products from the ground up.",
			Objective:  "Looking to join an early-stage startup where I can wear multiple hats and drive product development.",
			Experience: string(workExp1),
			Education:  string(education1),
			Skills:     string(skills1),
			Languages:  string(languages1),
			Template:   "classic",
			Theme:      "green",
		},
	}

	// Create resumes
	for _, resume := range resumes {
		var existingResume models.Resume
		if err := db.Where("user_id = ? AND title = ?", resume.UserID, resume.Title).First(&existingResume).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&resume).Error; err != nil {
				return err
			}
			log.Printf("Created resume: %s", resume.Title)
		}
	}

	log.Println("Database seeding completed successfully!")
	return nil
}

// GetSampleData returns sample data structures for reference
func GetSampleData() map[string]interface{} {
	return map[string]interface{}{
		"user": models.User{
			Name:       "John Doe",
			Email:      "john@example.com",
			Phone:      "+1234567890",
			Summary:    "Software Developer with 5 years of experience",
			Education:  "BS Computer Science",
			Experience: "5 years in web development",
			Skills:     "Go, JavaScript, React, Python",
			Languages:  "English, Spanish",
		},
		"work_experience": []models.WorkExperience{
			{
				Company:      "Tech Corp",
				Position:     "Senior Developer",
				Location:     "San Francisco, CA",
				StartDate:    time.Now().AddDate(-2, 0, 0),
				IsCurrent:    true,
				Description:  "Led development of microservices",
				Technologies: []string{"Go", "Docker", "Kubernetes"},
			},
		},
		"education": []models.Education{
			{
				Institution:  "University of Tech",
				Degree:       "Bachelor of Science",
				FieldOfStudy: "Computer Science",
				Location:     "Boston, MA",
				StartDate:    time.Now().AddDate(-8, 0, 0),
				EndDate:      &[]time.Time{time.Now().AddDate(-4, 0, 0)}[0],
				GPA:          "3.8/4.0",
			},
		},
		"skills": []models.Skill{
			{Name: "Go", Category: "Programming", Level: 5, YearsExp: 3},
			{Name: "JavaScript", Category: "Programming", Level: 4, YearsExp: 5},
		},
		"languages": []models.Language{
			{Name: "English", Proficiency: "Native"},
			{Name: "Spanish", Proficiency: "Conversational"},
		},
	}
}
