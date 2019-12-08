# Sound PFSes:
snd1: global, player
snd2: global, player
snd3: Classic NPC attack, hit, die 1
snd4: Classic NPC attack, hit, die 2
snd5: Classic NPC idle, loop
snd6: Classic zone 1
snd7: Classic zone 2
snd8: Velious zone
snd9: Velious NPC
snd10: Luclin NPC
snd11: Luclin zone
snd12: Vah Shir player
snd13: PoP NPC
snd14: PoP zone
snd15: Froglok player
snd16: LoY NPC
snd17: LoY zone

# Sound Types
SoundType 0 is for day/night environment sounds that play at a constant volume, such as bats screeching or wind blowing across an open area.

- SoundType 1 is for background music, with the option of specifying different music for daytime vs nighttime in the same location. 
If either SoundID is a negative number, it's a PoP-added reference to the associated line number in mp3index.txt. 
Otherwise, it indicates which sub-song to play in the ZoneNick.xmi MIDI file at that location.

- SoundType 2 is for environment sounds that play at all times of day or night, loudest at the center and quickly fading quieter as 
a character moves away. Campfires, for instance.

- SoundType 3 is for day/night sound effects like SoundType 0, but the sounds act like SoundType 2 where they are only at 
full volume within FullVolRange, and quickly drop off as the character moves farther away from them.