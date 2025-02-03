// Configuration constants
const CONFIG = {
  API_KEY: "1f19bc9cecfda41bf0714f3d92a7543e",
  API_BASE_URL: "https://api.openweathermap.org/data/2.5/weather",
  DEFAULT_VALUE: "--",
  UNITS: "metric",
  LANGUAGE: "vi",
};

// DOM element selectors
const ELEMENTS = {
  chatForm: document.querySelector("#chat-input-form"),
  chatInput: document.querySelector("#city-input"),
  chatMessages: document.querySelector("#chat-messages"),
  typingIndicator: document.querySelector(".typing-indicator"),
};

// Utility functions for data formatting
const formatters = {
  formatWindSpeed: (speedMS) => (speedMS * 3.6).toFixed(1),
  formatTime: (unixTimestamp) => moment.unix(unixTimestamp).format("H:mm"),
  formatVisibility: (visibilityMeters) => (visibilityMeters / 1000).toFixed(1),
  getCurrentTime: () => moment().format("HH:mm"),
};

// Chat UI functions
const chatUI = {
  addMessage(message, isSent = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isSent ? "sent" : "received"}`;
    messageDiv.innerHTML = `
            ${message}
            <div class="time">${formatters.getCurrentTime()}</div>
          `;
    ELEMENTS.chatMessages.insertBefore(messageDiv, ELEMENTS.typingIndicator);
    ELEMENTS.chatMessages.scrollTop = ELEMENTS.chatMessages.scrollHeight;
  },

  showTypingIndicator() {
    ELEMENTS.typingIndicator.classList.add("active");
  },

  hideTypingIndicator() {
    ELEMENTS.typingIndicator.classList.remove("active");
  },
};

class WeatherDataProcessor {
  static createWeatherDescription(data) {
    return (
      `${data.name} hiện có ${data.weather?.[0]?.description}, ` +
      `nhiệt độ ${data.main.temp.toFixed(
        1
      )}°C, cảm giác như ${data.main.feels_like.toFixed(1)}°C.\n` +
      `Độ ẩm ${
        data.main.humidity
      }%, gió thổi với tốc độ ${formatters.formatWindSpeed(
        data.wind?.speed
      )} km/h` +
      (data.wind?.gust
        ? `, có lúc giật mạnh tới ${formatters.formatWindSpeed(
            data.wind.gust
          )} km/h`
        : "") +
      `. ` +
      `Tầm nhìn xa ${formatters.formatVisibility(data.visibility)}km. ` +
      `Mặt trời mọc lúc ${formatters.formatTime(data.sys?.sunrise)}, ` +
      `lặn lúc ${formatters.formatTime(data.sys?.sunset)} ` +
      `(giờ ${data.sys.country}).`
    );
  }
}

// API interaction
class WeatherAPI {
  static async fetchWeatherData(city) {
    const url = new URL(CONFIG.API_BASE_URL);
    url.searchParams.append("q", city);
    url.searchParams.append("appid", CONFIG.API_KEY);
    url.searchParams.append("units", CONFIG.UNITS);
    url.searchParams.append("lang", CONFIG.LANGUAGE);

    try {
      chatUI.showTypingIndicator();
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const weatherDescription =
        WeatherDataProcessor.createWeatherDescription(data);

      // Add a small delay to simulate typing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      chatUI.hideTypingIndicator();
      chatUI.addMessage(weatherDescription);

      return data;
    } catch (error) {
      chatUI.hideTypingIndicator();
      throw new Error("Không tìm thấy thành phố hoặc có lỗi xảy ra.");
    }
  }
}

class EventHandlers {
  static async handleFormSubmit(event) {
    event.preventDefault();

    const city = ELEMENTS.chatInput.value.trim();

    if (!city) {
      chatUI.addMessage("Vui lòng nhập tên thành phố");
      return;
    }

    // Add user message to chat
    chatUI.addMessage(city, true);
    ELEMENTS.chatInput.value = "";

    try {
      await WeatherAPI.fetchWeatherData(city);
    } catch (error) {
      chatUI.addMessage(error.message);
    }
  }
}

function initializeEventListeners() {
  ELEMENTS.chatForm?.addEventListener("submit", EventHandlers.handleFormSubmit);
}

document.addEventListener("DOMContentLoaded", initializeEventListeners);
