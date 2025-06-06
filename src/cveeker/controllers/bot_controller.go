package controllers

import (
	"log"
	"os"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/smhnaqvi/cveeker/models"
	"gorm.io/gorm"
)

func StartBot(db *gorm.DB) {

	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	bot, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		log.Fatalf("Error initializing bot: %v", err)
	}
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.GetUpdatesChan(u)

	for update := range updates {
		if update.Message == nil {
			continue
		}

		var user models.UserModel
		if err := user.GetUserByChatID(update.Message.Chat.ID); err != nil {
			user.ChatID = &update.Message.Chat.ID
			user.Create()
		}

		text := update.Message.Text

		switch user.Step {
		case "", "name":
			user.Name = text
			user.Step = "email"
			bot.Send(tgbotapi.NewMessage(*user.ChatID, "What's your email?"))

		case "email":
			user.Email = text
			user.Step = "phone"
			bot.Send(tgbotapi.NewMessage(*user.ChatID, "Your phone number?"))

		case "phone":
			user.Phone = text
			user.Step = "summary"
			bot.Send(tgbotapi.NewMessage(*user.ChatID, "Write a short summary."))

		case "summary":
			user.Summary = text
			user.Step = "education"
			bot.Send(tgbotapi.NewMessage(*user.ChatID, "Education details?"))

		case "education":
			user.Education = text
			user.Step = "experience"
			bot.Send(tgbotapi.NewMessage(*user.ChatID, "Experience?"))

		case "experience":
			user.Experience = text
			user.Step = "skills"
			bot.Send(tgbotapi.NewMessage(*user.ChatID, "Skills?"))

		case "skills":
			user.Skills = text
			user.Step = "languages"
			bot.Send(tgbotapi.NewMessage(*user.ChatID, "Languages spoken?"))

		case "languages":
			user.Languages = text
			user.Step = "done"
			bot.Send(tgbotapi.NewMessage(*user.ChatID, "Generating your CV..."))
			// TODO: Generate and send CV
		}

		db.Save(&user)
	}
}
