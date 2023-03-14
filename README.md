
# Goal

I keep a Google sheet to keep track of unfamiliar words as part of my English learning process.
However, I can forget how to pronounce the words if I don't review them frequently enough.
Also it's probably more efficient to memorize words with pronunciations.
That's why I had the idea to develop a Javascript script that reads the words from
the selected range in my Google Sheet.

The goal of this script is to retrieve words from a selected range within a Google sheet.

# Limitations

Unfortunately, after spending a day on development, I discovered it's not possible to
obtain an A1notion description (like A1:B2) for the current selected range
in a google sheet. This function is currently unsupported.

# Current Workaround

One way to overcome this barrier is to utilize Google Sheets scripts.
However the TTS service needs to be carefully examined.
Right now, the range will be hard-coded to column `A` in v0.1 version.

# Other Details

During development, I utilized ChatGPT and received valuable information, suggestions
and even code review comments. I took note of them all to help improve my code.
