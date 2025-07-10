package models

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/smhnaqvi/cvilo/database"
)

// ChatPromptHistory represents the chat prompt history for a resume
type ChatPromptHistory struct {
	ID        uint      `json:"id" gorm:"primarykey"`
	ResumeID  uint      `json:"resume_id" gorm:"not null"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	Prompt    string    `json:"prompt" gorm:"type:text;not null"`
	Response  string    `json:"response" gorm:"type:text"`        // AI response summary or metadata
	Provider  string    `json:"provider" gorm:"default:'openai'"` // AI provider used (openai, github_models, etc.)
	Status    string    `json:"status" gorm:"default:'success'"`  // success, failed, partial
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName overrides the table name used by ChatPromptHistory to `chat_prompt_history`
func (ChatPromptHistory) TableName() string {
	return "chat_prompt_history"
}

// Create creates a new chat prompt history record
func (cph *ChatPromptHistory) Create() error {
	db := database.GetSqliteDB()
	if err := db.Create(&cph).Error; err != nil {
		return err
	}

	// Load the relationships
	db.First(&cph, cph.ID)
	return nil
}

// GetByID retrieves a chat prompt history by ID
func (cph *ChatPromptHistory) GetByID(id uint) error {
	db := database.GetSqliteDB()
	if err := db.First(&cph, id).Error; err == nil {
		return nil
	}
	return errors.New("chat prompt history not found")
}

// GetByResumeID retrieves all chat prompt history for a specific resume
func (cph *ChatPromptHistory) GetByResumeID(resumeID uint) ([]ChatPromptHistory, error) {
	db := database.GetSqliteDB()
	var history []ChatPromptHistory
	if err := db.Where("resume_id = ?", resumeID).
		Order("created_at DESC").
		Find(&history).Error; err == nil {
		return history, nil
	}
	return nil, errors.New("chat prompt history not found")
}

// GetByUserID retrieves all chat prompt history for a specific user
func (cph *ChatPromptHistory) GetByUserID(userID uint) ([]ChatPromptHistory, error) {
	db := database.GetSqliteDB()
	var history []ChatPromptHistory
	if err := db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&history).Error; err == nil {
		return history, nil
	}
	return nil, errors.New("chat prompt history not found")
}

// GetRecentByResumeID retrieves recent chat prompt history for a resume (last N entries)
func (cph *ChatPromptHistory) GetRecentByResumeID(resumeID uint, limit int) ([]ChatPromptHistory, error) {
	db := database.GetSqliteDB()
	var history []ChatPromptHistory
	if err := db.Where("resume_id = ?", resumeID).
		Order("created_at DESC").
		Limit(limit).
		Find(&history).Error; err == nil {
		return history, nil
	}
	return nil, errors.New("chat prompt history not found")
}

// Update updates a chat prompt history record
func (cph *ChatPromptHistory) Update() error {
	db := database.GetSqliteDB()
	if err := db.Save(&cph).Error; err != nil {
		return err
	}

	// Load the relationships
	db.First(&cph, cph.ID)
	return nil
}

// Delete deletes a chat prompt history record
func (cph *ChatPromptHistory) Delete(id uint) error {
	db := database.GetSqliteDB()
	if err := db.Delete(&cph, id).Error; err != nil {
		return err
	}
	return nil
}

// DeleteByResumeID deletes all chat prompt history for a specific resume
func (cph *ChatPromptHistory) DeleteByResumeID(resumeID uint) error {
	db := database.GetSqliteDB()
	if err := db.Where("resume_id = ?", resumeID).Delete(&ChatPromptHistory{}).Error; err != nil {
		return err
	}
	return nil
}

// GetPromptHistoryForAI retrieves formatted prompt history for AI context
func (cph *ChatPromptHistory) GetPromptHistoryForAI(resumeID uint, maxHistory int) (string, error) {
	history, err := cph.GetRecentByResumeID(resumeID, maxHistory)
	if err != nil {
		return "", err
	}

	if len(history) == 0 {
		return "", nil
	}

	// Format history for AI context
	var contextBuilder strings.Builder
	contextBuilder.WriteString("Previous conversation history for this resume:\n\n")

	for i, entry := range history {
		contextBuilder.WriteString(fmt.Sprintf("User (Prompt %d): %s\n", i+1, entry.Prompt))
		if entry.Response != "" {
			contextBuilder.WriteString(fmt.Sprintf("AI Response: %s\n", entry.Response))
		}
		contextBuilder.WriteString("---\n")
	}

	return contextBuilder.String(), nil
}
