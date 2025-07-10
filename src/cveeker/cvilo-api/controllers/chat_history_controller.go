package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/smhnaqvi/cvilo/models"
	"github.com/smhnaqvi/cvilo/utils"
)

type ChatHistoryController struct{}

func NewChatHistoryController() *ChatHistoryController {
	return &ChatHistoryController{}
}

// GetChatHistoryByResume retrieves chat prompt history for a specific resume
func (chc *ChatHistoryController) GetChatHistoryByResume(c *gin.Context) {
	resumeID, err := strconv.Atoi(c.Param("resume_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	var history models.ChatPromptHistory
	chatHistory, err := history.GetByResumeID(uint(resumeID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chat history not found"})
		return
	}

	utils.Success(c, "Chat history retrieved successfully", gin.H{
		"resume_id": resumeID,
		"history":   chatHistory,
		"count":     len(chatHistory),
	})
}

// GetChatHistoryByUser retrieves all chat prompt history for a specific user
func (chc *ChatHistoryController) GetChatHistoryByUser(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var history models.ChatPromptHistory
	chatHistory, err := history.GetByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chat history not found"})
		return
	}

	utils.Success(c, "Chat history retrieved successfully", gin.H{
		"user_id": userID,
		"history": chatHistory,
		"count":   len(chatHistory),
	})
}

// GetRecentChatHistory retrieves recent chat prompt history for a resume (with limit)
func (chc *ChatHistoryController) GetRecentChatHistory(c *gin.Context) {
	resumeID, err := strconv.Atoi(c.Param("resume_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 10
	}

	var history models.ChatPromptHistory
	chatHistory, err := history.GetRecentByResumeID(uint(resumeID), limit)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chat history not found"})
		return
	}

	utils.Success(c, "Recent chat history retrieved successfully", gin.H{
		"resume_id": resumeID,
		"history":   chatHistory,
		"count":     len(chatHistory),
		"limit":     limit,
	})
}

// DeleteChatHistory deletes a specific chat prompt history entry
func (chc *ChatHistoryController) DeleteChatHistory(c *gin.Context) {
	historyID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid history ID"})
		return
	}

	var history models.ChatPromptHistory
	if err := history.GetByID(uint(historyID)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chat history not found"})
		return
	}

	if err := history.Delete(uint(historyID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete chat history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Chat history deleted successfully"})
}

// DeleteChatHistoryByResume deletes all chat prompt history for a specific resume
func (chc *ChatHistoryController) DeleteChatHistoryByResume(c *gin.Context) {
	resumeID, err := strconv.Atoi(c.Param("resume_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resume ID"})
		return
	}

	var history models.ChatPromptHistory
	if err := history.DeleteByResumeID(uint(resumeID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete chat history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "All chat history for resume deleted successfully"})
}

// GetChatHistoryStats retrieves statistics about chat prompt history
func (chc *ChatHistoryController) GetChatHistoryStats(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var history models.ChatPromptHistory
	chatHistory, err := history.GetByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chat history not found"})
		return
	}

	// Calculate statistics
	totalPrompts := len(chatHistory)
	successCount := 0
	failedCount := 0
	providerStats := make(map[string]int)

	for _, entry := range chatHistory {
		if entry.Status == "success" {
			successCount++
		} else if entry.Status == "failed" {
			failedCount++
		}
		providerStats[entry.Provider]++
	}

	utils.Success(c, "Chat history statistics retrieved successfully", gin.H{
		"user_id":        userID,
		"total_prompts":  totalPrompts,
		"success_count":  successCount,
		"failed_count":   failedCount,
		"provider_stats": providerStats,
	})
}
