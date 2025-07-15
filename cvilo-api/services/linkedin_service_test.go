package services

import (
	"testing"
)

func TestExtractLinkedInID(t *testing.T) {
	service := &LinkedInService{}

	tests := []struct {
		name       string
		profileURL string
		expected   string
	}{
		{
			name:       "Valid LinkedIn URL",
			profileURL: "https://www.linkedin.com/in/johndoe",
			expected:   "johndoe",
		},
		{
			name:       "Empty URL",
			profileURL: "",
			expected:   "",
		},
		{
			name:       "URL with trailing slash",
			profileURL: "https://www.linkedin.com/in/johndoe/",
			expected:   "",
		},
		{
			name:       "Complex URL",
			profileURL: "https://www.linkedin.com/in/john-doe-123456789",
			expected:   "john-doe-123456789",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := service.ExtractLinkedInID(tt.profileURL)
			if result != tt.expected {
				t.Errorf("ExtractLinkedInID(%s) = %s, want %s", tt.profileURL, result, tt.expected)
			}
		})
	}
}

func TestExtractString(t *testing.T) {
	data := map[string]interface{}{
		"name":    "John Doe",
		"age":     30,
		"active":  true,
		"missing": nil,
	}

	tests := []struct {
		name     string
		key      string
		expected string
	}{
		{
			name:     "String value",
			key:      "name",
			expected: "John Doe",
		},
		{
			name:     "Missing key",
			key:      "missing",
			expected: "",
		},
		{
			name:     "Non-string value",
			key:      "age",
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := extractString(data, tt.key)
			if result != tt.expected {
				t.Errorf("extractString(data, %s) = %s, want %s", tt.key, result, tt.expected)
			}
		})
	}
}

func TestExtractFloat(t *testing.T) {
	data := map[string]interface{}{
		"age":     30.5,
		"name":    "John Doe",
		"missing": nil,
	}

	tests := []struct {
		name     string
		key      string
		expected float64
	}{
		{
			name:     "Float value",
			key:      "age",
			expected: 30.5,
		},
		{
			name:     "Missing key",
			key:      "missing",
			expected: 0,
		},
		{
			name:     "Non-float value",
			key:      "name",
			expected: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := extractFloat(data, tt.key)
			if result != tt.expected {
				t.Errorf("extractFloat(data, %s) = %f, want %f", tt.key, result, tt.expected)
			}
		})
	}
}
