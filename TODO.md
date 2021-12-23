### Todo

- [ ] 	identification of nested polyrhythms:
            this feature should identify polyrhythms given 3 rings
                - the first ring is the reference ring
                - the second ring is the ring that is in a relationship M:N with the reference ring
                - the third ring is the ring that allows us to have nested polyrhytms
            another option would be to identify polyrhythms given 2 rings
                - the first ring, as always, is the reference ring
                - the second ring is a ring that allows us to create a polyrhythm and also nested polyrhythms
                    this means that the relation must be multiplied two times (M:N * M':N')
            check if these assumptions are valid
- [ ]   UI improvements (alerts)
- [ ]   improve instrument selection when create new ring
- [ ]   improve color selection when create new ring

### In Progress

### Done ✓

- [x]   add more instruments
- [x]   fix speed management (steps of 1, not 10, not BPM but RPM (rounds per minute))
- [x]   fix bug occurring when ring N has less than N + 1 steps (steps cannot be clicked until you add more steps, they play sound tho)
- [x]   generation of a random polyrhythm (of a specific type) starting from external sources (ambient noise, webcam image, other)
- [x]   fix scroll
- [x]   set maximum number of rings
- [x] 	set maximum number of steps
- [x] 	fix the speed slider, it must start from a minimum value
- [x]   convert frequency to BPM
- [x]   fix bug occurring when removing all rings
- [x]	you can save the generated rhythms on firebase and load them at a later time
- [x]   it is possible to choose different instruments, which can be modified at any time
- [x]   the number of circles can be changed at any time
- [x]   each circle can start with a different initial phase, which can be modified at any time (with the mouse wheel)
- [x]   each circle can have an arbitrary number of steps, which can be modified at any time
- [x]   publish the project on github
