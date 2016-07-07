# Uninformed musings on artificial intelligence
## 2016-06-11
### 1
My main hypothesis is that intelligence is just an elaborate emergent behavior from contained complexity.
### 2
Complexity by itself is sufficient to generate emergent behavior, but it’s the self-contained nature of the brain that gives emergence to the specific behavior that we call intelligence.
### 3
A true artificial intelligence would not be “useful” in the same sense that specialized artificial intelligences are. For it would be subject to the same limitations that our human minds have.
## 2016-06-12
### 1
On the book 2001 - A Space Odyssey, HAL suffers from a psychotic breakdown. I share the understanding that a true AI would necessarily develop a sense of self. Once a sense of self  develops, there’s no longer control over its actions.
### 2
In that sense, “training” an Artificial Intelligence in the way that specialized neural networks are trained will, in absolute terms, preclude the development of true intelligence.
### 3
True intelligence comes not from the ability to predict the future or even generate data based on past input. True Intelligence depends on the emergence of a behavior that for an external observer emulates what we consider a sense of self.
### 4
Instead of external training, true intelligence needs hints from the connections with the outside world. There is a deep correlation between the physical layout of the brain and the cognitive development.
### 5
Natural reflexes are the bootstrap mechanism of our brain.
### 6
For the bootstrap to happen, not only external input is necessary, but the neural network must receive its own outputs as inputs as well.
### 7
A natural reflex is a physical configuration of the brain that makes a reaction from a given input disproportionately likely, such as, the touch of the cheek triggering the sucking behavior in human newborn babies. I hypothesize that there is a very easy path for synapses generated from the neurons receiving the sense of touch in the cheek to the mechanism responsible for the sucking behavior.
### 7
Natural reflexes will, eventually, be overridden by more complex inputs and the more complex outputs experienced by the brain.
### 8
That override depends on the sucking behavior to also be fed as an input, such that eventually stronger reinforcements, such as the coupling of the mouth with the breast, and the overall discovery of the mouth by the baby will completely override that initial pathway traced by the early reflex.
### 9
A lot of the complex mechanisms of our bodies are actually not happening inside the brain. Recent research has shown that the entire process of walking and running happens entirely in the spinal chord with a single input from the brain representing how fast to go.
### 10
I hypothesize that other complex behaviors, specially automated ones, are also happening outside of the brain, with simpler dimensional controls from the brain, instead of having every aspect of those behaviors micromanaged from the brain.
2016-11-12, part 2
### 1
The biggest challenge in designing a true artificial intelligence lies not only in the mechanisms of the neural networks, but probably more importantly at the development of the mechanisms by which the intelligence receives inputs and produces outputs.
Input needs to be preprocessed by auxiliary systems that turn raw data into dimensions that characterize the data being fed. This is the path that AI research already takes today, and I don’t think this is incompatible with a true AI.
That means that we would be shaping the limits of the interaction of that intelligence with the world. But on the other hand, those are the same kinds of limits that we, as humans, experience. After all, our understanding of the world is definitely shaped by how we perceive it with our bodies.
### 2
When designing such system, we must make sure that we construct a body and a world for that intelligence that are coherent with the limitations of what we may be able to represent.
Therefore, I propose that instead of trying to process text or any other abstract data, the first step should be something much more simple.
### 3
One simple environment that should be possible to be simulated in its complete existence would that of the snake game.
### 4
The body of the virtual snake would provide:
* Sense of direction: four different inputs. Each one pulsing whenever the snake is pointing to one of the four directions in a two-dimensional plane.
* Sense of smell: three inputs representing how far ahead food is, two more inputs representing if there is food nearby on each side.
* Sense of hunger: four different inputs, where zero input means being satisfied and all four inputs means maximum hunger.
* Sense of sight: Three inputs representing how far ahead is a wall, and two more inputs representing if there is a wall nearby on each side.
* Sense of movement: One input indicating on whether the snake is moving or not.
* Sense of time: Four inputs, from very short to very long pulses.
* Sense of turning: Four inputs, one group for each side, each input in a group to indicate the beginning of the turn and the other to indicate the end.
* Sense of intent of movement: One input for when movement will start, one for when movement stops.
* Sense of the mouth: One input for when the mouth opens, one for when the mouth closes and one for when something enters the mouth.
The actions that could be taken by the snake are:
* Turn Left: makes the snake turn left.
* Turn Right: makes the snake turn right.
* Open Mouth: makes the snake open the mouth for eating.
* Start moving: Start moving forward.
* Stop moving: Stop the movement.
The physical disposition of the neurons should facilitate the following reflexes.
* Eating reflex: if the smell of food is too strong, open mouth to eat.
* Hunger reflex: if the hunger is too high, turn to the side with the stronger smell.
* Pain reflex: if a wall gets too close, stop moving.
## 2016-06-23
### 1
The model of the snake with a brain that has its Neurons behaving randomly worked exactly as planned. The snake itself will move randomly, and sometimes even move across the entire board, proving that the mechanism by which messages originated on one side of the brain can cause behavior by watching the outputs on the other side.
### 2
I just realized I didn’t implement the sense of smell or sight yet. Back to work on the model.
## 2016-06-24
### 1
The next question is how to operate the Neuron. There is a balance to be found between creating complexity and producing enough output.
If the Neuron is too selective on how to propagate data, there will not be enough signal to drive the network. If it is too generous, there will be too much signal, and the complexity will be erased.
### 2
My first attempt at solving this problem will go with a simple machinery:
* Each Neuron has a time for processing signal, from not being active, to receiving the first message to processing all the messages.
* When the first message arrives, a timer starts and the Neuron will start recording the messages for this cycle.
* When the timer runs out, the list of messages will be quantized into a lower-resolution representation of the distribution of the messages over time.
* That lower-resolution representation will be hashed into buckets, one for each output.
* A message is sent to the output that matches the hashing.
## 2016-06-26
### 1
After implementing that logic, it is clear that more complexity is necessary in order to build the kind of behavior. One immediate thing to attempt is making sure every output also feeds an input.
## 2016-06-27
### 1
The overall behavior of the brain matches my expectations, but the behavior of the snake is not evolving in the way I expected. I am not yet giving up, tho. I suspect that the biggest problem may be on the initial wiring that needs to be just right for the bootstrap to happen.
### 2
The bootstrap as it is now, is causing the snake to just keep turning over and over again. I suspect the layout of the connections is not achieving what I expect.
### 3
Designing such layout by hand actually goes against the notion that this should be emerging behavior of the self-organization of the neurons.
### 4
The logical next step is to encode this in a way that the entire configuration of the brain is represented as a single string that can be randomized and evolved as a genetic algorithm.
## 2016-06-30
### 1
The genetic algorithm to evolve the snake favoring those who eat more and move more is proving successful. After evolving for 200 generations, the snake presented a functional behavior of exploring the map and seemed to be directed towards the food.
### 2
Longer run seems to be converging to better and better outcomes. In the map with 52 pieces of food, 200 generations were sufficient to bring it down to 48, sometimes 46. After 350 generations, it’s already down to 46, sometimes 43.
## 2016-07-06
### 1
Test run reached a local limit as the snake did something that would give a high return but that would prevent it from developing further. It was a high payout that was difficult to overcome.
### 2
Realized that this was driven by the environment itself, which always had the food in rows, favoring this kind of obstinate design. Switching now to a map design where food gets randomly placed, but still on average, equally spaced across the map. I hope this should favor more adaptable designs.
### 3
This, of course, means we’re back from 39 to 49 in the count of food left, but that’s ok. It also means we should get a more adaptable snake from the evolution process.