#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate Audio Files for Cantonese Medical Handbook

This script generates Cantonese text-to-speech audio files for medical phrases
using Azure Cognitive Services Speech API.

Usage:
    python generate_audio.py                    # Generate for all missing sections
    python generate_audio.py dermatology        # Generate for specific section
    python generate_audio.py --all              # Regenerate all sections
    python generate_audio.py --check            # Check which sections need audio

Requirements:
    - Azure Cognitive Services Speech SDK
    - Valid Azure subscription key

Install dependencies:
    pip install azure-cognitiveservices-speech
"""

import os
import json
import sys
import argparse
import time
from pathlib import Path

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    import azure.cognitiveservices.speech as speechsdk
except ImportError:
    print("ERROR: Azure Speech SDK not installed.")
    print("Install with: pip install azure-cognitiveservices-speech")
    sys.exit(1)

# Azure Configuration
# Note: For production, use environment variables for security
SPEECH_KEY = "0d2548cbe6b1426eb631f90612a755ff"
SPEECH_REGION = "eastus"

# All available sections
ALL_SECTIONS = [
    'introductions',
    'complaints',
    'medications',
    'allergies',
    'history_questions',
    'family_history',
    'prior_illnesses',
    'cardiology',
    'cardiovascular_illnesses',
    'anatomy',
    'emergency',
    'dermatology',
    'endocrinology',
    'gastroenterology'
]

def get_speech_config():
    """Initialize Azure Speech configuration"""
    speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)
    speech_config.speech_synthesis_language = "zh-HK"
    speech_config.speech_synthesis_voice_name = "zh-HK-HiuGaaiNeural"
    speech_config.set_speech_synthesis_output_format(
        speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
    )
    return speech_config

def load_section_data(section_name):
    """Load data for a section from JSON file"""
    json_path = Path('data') / f'{section_name}.json'

    if not json_path.exists():
        raise FileNotFoundError(f"Data file not found: {json_path}")

    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def check_section_audio(section_name):
    """Check if a section has audio files"""
    audio_dir = Path(f'{section_name}_audio')

    if not audio_dir.exists():
        return False, 0

    audio_files = list(audio_dir.glob('*.mp3'))
    return True, len(audio_files)

def get_missing_sections():
    """Find sections that are missing audio files"""
    missing = []

    for section in ALL_SECTIONS:
        has_audio, count = check_section_audio(section)

        try:
            data = load_section_data(section)
            expected_count = len(data)

            if not has_audio or count < expected_count:
                missing.append({
                    'section': section,
                    'has_audio': has_audio,
                    'current': count,
                    'expected': expected_count,
                    'missing': expected_count - count
                })
        except FileNotFoundError:
            print(f"Warning: No data file for {section}")

    return missing

def generate_audio_for_section(section_name, force=False):
    """Generate audio files for a specific section"""
    print(f"\n{'='*60}")
    print(f"Generating audio for: {section_name}")
    print(f"{'='*60}\n")

    # Load data
    try:
        data = load_section_data(section_name)
    except FileNotFoundError as e:
        print(f"ERROR: {e}")
        return False

    if not data:
        print(f"No data found for {section_name}")
        return False

    print(f"Found {len(data)} entries")

    # Create audio directory
    audio_dir = Path(f'{section_name}_audio')
    audio_dir.mkdir(exist_ok=True)
    print(f"Audio directory: {audio_dir}")

    # Initialize speech config
    try:
        speech_config = get_speech_config()
    except Exception as e:
        print(f"ERROR: Failed to initialize Azure Speech: {e}")
        print("Check your Azure subscription key and region")
        return False

    # Generate audio for each entry
    success_count = 0
    error_count = 0
    skipped_count = 0

    for entry in data:
        entry_id = entry.get('id', '')
        characters = entry.get('characters', '')

        if not characters:
            print(f"WARNING: Entry {entry_id}: No characters found, skipping")
            skipped_count += 1
            continue

        audio_file = audio_dir / f'{entry_id}.mp3'

        # Skip if file exists and not forcing
        if audio_file.exists() and not force:
            print(f"[OK] Entry {entry_id}: Already exists, skipping")
            skipped_count += 1
            continue

        # Generate audio
        try:
            audio_config = speechsdk.audio.AudioOutputConfig(filename=str(audio_file))
            speech_synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=speech_config,
                audio_config=audio_config
            )

            result = speech_synthesizer.speak_text_async(characters).get()

            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                print(f"[OK] Entry {entry_id}: Generated {audio_file.name}")
                success_count += 1
                time.sleep(0.1)  # Small delay to avoid rate limiting
            elif result.reason == speechsdk.ResultReason.Canceled:
                cancellation = result.cancellation_details
                print(f"[FAIL] Entry {entry_id}: Failed - {cancellation.reason}")
                if cancellation.error_details:
                    print(f"  Error: {cancellation.error_details}")
                error_count += 1
            else:
                print(f"[FAIL] Entry {entry_id}: Unknown error")
                error_count += 1

        except Exception as e:
            print(f"[FAIL] Entry {entry_id}: Exception - {e}")
            error_count += 1

    # Summary
    print(f"\n{'-'*60}")
    print(f"Summary for {section_name}:")
    print(f"  [OK] Generated: {success_count}")
    print(f"  [SKIP] Skipped:   {skipped_count}")
    print(f"  [FAIL] Errors:    {error_count}")
    print(f"{'-'*60}\n")

    return error_count == 0

def check_status():
    """Check status of audio files for all sections"""
    print("\nAudio File Status")
    print("="*80)
    print(f"{'Section':<25} {'Has Audio':<12} {'Files':<8} {'Expected':<10} {'Status'}")
    print("-"*80)

    missing_sections = []

    for section in ALL_SECTIONS:
        has_audio, count = check_section_audio(section)

        try:
            data = load_section_data(section)
            expected = len(data)

            if count < expected:
                status = f"MISSING {expected - count}"
                missing_sections.append(section)
            else:
                status = "OK"

            print(f"{section:<25} {str(has_audio):<12} {count:<8} {expected:<10} {status}")

        except FileNotFoundError:
            print(f"{section:<25} {'N/A':<12} {'N/A':<8} {'N/A':<10} NO DATA")

    print("="*80)

    if missing_sections:
        print(f"\nWARNING: {len(missing_sections)} sections need audio generation:")
        for section in missing_sections:
            print(f"  - {section}")
        print(f"\nRun: python generate_audio.py")
    else:
        print("\nSUCCESS: All sections have complete audio!")

    return missing_sections

def main():
    parser = argparse.ArgumentParser(
        description='Generate Cantonese audio files for medical handbook'
    )
    parser.add_argument(
        'sections',
        nargs='*',
        help='Specific sections to generate (default: all missing sections)'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Regenerate audio for all sections'
    )
    parser.add_argument(
        '--force',
        action='store_true',
        help='Overwrite existing audio files'
    )
    parser.add_argument(
        '--check',
        action='store_true',
        help='Check which sections need audio'
    )

    args = parser.parse_args()

    # Change to script directory
    os.chdir(Path(__file__).parent)

    # Check status only
    if args.check:
        check_status()
        return

    # Determine which sections to process
    if args.sections:
        sections_to_process = args.sections
    elif args.all:
        sections_to_process = ALL_SECTIONS
    else:
        # Default: process missing sections
        missing = get_missing_sections()
        if not missing:
            print("SUCCESS: All sections have complete audio!")
            print("\nUse --check to see detailed status")
            print("Use --all to regenerate all audio")
            return

        print(f"Found {len(missing)} sections needing audio:\n")
        for info in missing:
            print(f"  - {info['section']}: {info['missing']} files needed")

        print(f"\nWill generate audio for these {len(missing)} sections.")
        response = input("Continue? (y/n): ")
        if response.lower() != 'y':
            print("Cancelled.")
            return

        sections_to_process = [info['section'] for info in missing]

    # Generate audio
    print(f"\nGenerating audio for {len(sections_to_process)} section(s)...")

    success_count = 0
    for section in sections_to_process:
        if section not in ALL_SECTIONS:
            print(f"WARNING: Unknown section: {section}")
            continue

        if generate_audio_for_section(section, force=args.force):
            success_count += 1

    # Final summary
    print("\n" + "="*60)
    print("FINAL SUMMARY")
    print("="*60)
    print(f"Processed {len(sections_to_process)} sections")
    print(f"Successful: {success_count}")
    print(f"Failed: {len(sections_to_process) - success_count}")
    print("="*60)

    if success_count == len(sections_to_process):
        print("\nSUCCESS: All audio generation completed successfully!")
    else:
        print("\nWARNING: Some audio generation failed. Check errors above.")

if __name__ == '__main__':
    main()
