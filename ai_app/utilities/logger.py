import logging

# logging.basicConfig(
#     level=logging.DEBUG,
#     format='%(asctime)s - %(levelname)s - %(message)s'
# )
#
# logger = logging.getLogger(__name__)

# Define colors
class LogColors:
    DEBUG = "\033[0;37m"  # White
    INFO = "\033[0;32m"   # Green
    WARNING = "\033[0;33m"  # Yellow
    ERROR = "\033[0;31m"   # Red
    CRITICAL = "\033[1;41m"  # Red background
    RESET = "\033[0m"      # Reset color

# Custom formatter
class ColoredFormatter(logging.Formatter):
    def format(self, record):
        if record.levelno == logging.DEBUG:
            record.msg = f"{LogColors.DEBUG}{record.msg}{LogColors.RESET}"
        elif record.levelno == logging.INFO:
            record.msg = f"{LogColors.INFO}{record.msg}{LogColors.RESET}"
        elif record.levelno == logging.WARNING:
            record.msg = f"{LogColors.WARNING}{record.msg}{LogColors.RESET}"
        elif record.levelno == logging.ERROR:
            record.msg = f"{LogColors.ERROR}{record.msg}{LogColors.RESET}"
        elif record.levelno == logging.CRITICAL:
            record.msg = f"{LogColors.CRITICAL}{record.msg}{LogColors.RESET}"
        return super().format(record)

# Configure the logger
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
formatter = ColoredFormatter("%(asctime)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)  # Set to DEBUG to capture all levels