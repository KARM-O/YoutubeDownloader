import os
import tempfile

from yt_dlp import YoutubeDL


def download(url, filetype):

    temp_dir = tempfile.mkdtemp()

    if filetype == "mp3":

        options = {

            "format": "bestaudio/best",

            "outtmpl": os.path.join(temp_dir, "%(title)s.%(ext)s"),

            "postprocessors": [{

                "key": "FFmpegExtractAudio",

                "preferredcodec": "mp3",

                "preferredquality": "192"

            }]

        }

    else:

        options = {

            "format": "best",

            "outtmpl": os.path.join(temp_dir, "%(title)s.%(ext)s")

        }

    with YoutubeDL(options) as ydl:

        info = ydl.extract_info(url, download=True)

        filename = ydl.prepare_filename(info)

        if filetype == "mp3":

            filename = os.path.splitext(filename)[0] + ".mp3"

    return filename