package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/smhnaqvi/cveeker/models"
	"gorm.io/gorm"
)

type UserController struct {
	db *gorm.DB
}

func NewUserController(db *gorm.DB) *UserController {
	return &UserController{db: db}
}

// CreateUser creates a new user
func (uc *UserController) CreateUser(c *gin.Context) {
	var req models.UserCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if req.Name == "" || req.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name and email are required"})
		return
	}

	// Check if user with email already exists
	var existingUser models.User
	if err := uc.db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
		return
	}

	// Create user from request
	user := models.User{
		Name:     req.Name,
		Email:    req.Email,
		Phone:    req.Phone,
		Summary:  req.Summary,
		Location: req.Location,
		Website:  req.Website,
		LinkedIn: req.LinkedIn,
		GitHub:   req.GitHub,
	}

	if err := uc.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Convert to response
	userResponse := models.UserResponse{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		Name:      user.Name,
		Email:     user.Email,
		Phone:     user.Phone,
		Summary:   user.Summary,
		Location:  user.Location,
		Website:   user.Website,
		LinkedIn:  user.LinkedIn,
		GitHub:    user.GitHub,
		Step:      user.Step,
		IsActive:  user.IsActive,
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user":    userResponse,
	})
}

// GetUser retrieves a user by ID
func (uc *UserController) GetUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := uc.db.Preload("Resumes").First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetUsers retrieves all users with pagination
func (uc *UserController) GetUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var users []models.User
	var total int64

	uc.db.Model(&models.User{}).Count(&total)

	if err := uc.db.Limit(limit).Offset(offset).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"pagination": gin.H{
			"current_page": page,
			"per_page":     limit,
			"total":        total,
			"total_pages":  (total + int64(limit) - 1) / int64(limit),
		},
	})
}

// UpdateUser updates an existing user
func (uc *UserController) UpdateUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := uc.db.First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	var req models.UserUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update only provided fields
	updates := make(map[string]interface{})

	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Phone != "" {
		updates["phone"] = req.Phone
	}
	if req.Summary != "" {
		updates["summary"] = req.Summary
	}
	if req.Education != "" {
		updates["education"] = req.Education
	}
	if req.Experience != "" {
		updates["experience"] = req.Experience
	}
	if req.Skills != "" {
		updates["skills"] = req.Skills
	}
	if req.Languages != "" {
		updates["languages"] = req.Languages
	}
	if req.Location != "" {
		updates["location"] = req.Location
	}
	if req.Website != "" {
		updates["website"] = req.Website
	}
	if req.LinkedIn != "" {
		updates["linkedin"] = req.LinkedIn
	}
	if req.GitHub != "" {
		updates["github"] = req.GitHub
	}
	if req.Step != "" {
		updates["step"] = req.Step
	}
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}

	if err := uc.db.Model(&user).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	// Fetch updated user
	uc.db.First(&user, id)

	c.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
		"user":    user,
	})
}

// DeleteUser deletes a user by ID
func (uc *UserController) DeleteUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := uc.db.First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	// Delete associated resumes first
	if err := uc.db.Where("user_id = ?", id).Delete(&models.Resume{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user's resumes"})
		return
	}

	if err := uc.db.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// GetUserByEmail retrieves a user by email
func (uc *UserController) GetUserByEmail(c *gin.Context) {
	email := c.Query("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email parameter is required"})
		return
	}

	var user models.User
	if err := uc.db.Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// ToggleUserStatus toggles the active status of a user
func (uc *UserController) ToggleUserStatus(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := uc.db.First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user"})
		return
	}

	user.IsActive = !user.IsActive
	if err := uc.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "User status updated successfully",
		"is_active": user.IsActive,
	})
}
