import os
import azure.cognitiveservices.speech as speechsdk
import csv
import pandas as pd

# This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
SPEECH_KEY="0d2548cbe6b1426eb631f90612a755ff"
SPEECH_REGION="eastus"
# speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))
speech_config = speechsdk.SpeechConfig(SPEECH_KEY, SPEECH_REGION)
speech_config.speech_synthesis_language = "zh-HK" 
speech_config.speech_synthesis_voice_name ="zh-HK-HiuGaaiNeural"
speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3)
# audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
audioOuputFile = './test.mp3'
# audio_config = speechsdk.audio.AudioOutputConfig(filename=audioOuputFile)

# The language of the voice that speaks.
# speech_config.speech_synthesis_voice_name='en-US-JennyNeural'
folder="cardiovascular_illnesses"
xls = pd.ExcelFile('./data.xlsx')
df = pd.read_excel(xls, folder, skiprows=[0])
chars = df.loc[:,"Characters"]
path=f"./{folder}_audio/"
if not os.path.exists(path):
    os.makedirs(path)
for c, i in zip(chars, range(len(chars))):
    print(i, c)
    audioOuputFile = f'./{folder}_audio/{i+1}.mp3'
    audio_config = speechsdk.audio.AudioOutputConfig(filename=audioOuputFile)
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
    speech_synthesis_result = speech_synthesizer.speak_text_async(c).get()


# # Get text from the console and synthesize to the default speaker.
# print("Enter some text that you want to speak >")
# # text = input()

# # speech_synthesis_result = speech_synthesizer.speak_text_async(text).get()

# if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
#     print("Speech synthesized for text [{}]".format(text))
# elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
#     cancellation_details = speech_synthesis_result.cancellation_details
#     print("Speech synthesis canceled: {}".format(cancellation_details.reason))
#     if cancellation_details.reason == speechsdk.CancellationReason.Error:
#         if cancellation_details.error_details:
#             print("Error details: {}".format(cancellation_details.error_details))
#             print("Did you set the speech resource key and region values?")
