
A wrapper around RxJs reactivity with a simpler interface

Show me the code

```typescript
/** Don't install via npm, you have to clone this repo to use it
 *  This code is not transpiled, your bundler has to transpile
 *  it at build time
 */
import { observe, onChange } from '@asasvirtuais/state/src'

// Some code
onChange(
    ({ var1, var2, var3 }) => {
        console.log('Reacting to change', var1, var2, va3)
    },
    observe({ var1, var2, va3 })
)
```

# State management

Levels of state management
- Component: shared states across components in the same app
- App: Share state across multiple apps in the same page
- Thread: Share state across multiple JavaScript threads
- Machine: Share state across machines in the network

Suggested namespaces for state management in different levels:
- Local or none (components of the same app)
- Global (apps and JavaScript threads in the same runtime (vague))
- Network (machines in communication)

## Default level

Most apps nowadays are developed at the Local level, but given the importance that multi threading is bringing to front-end development it is reasonable to consider the global level the near future default

## Different approaches, different needs.

Observables:
    We have observables when reactivity is enforced for a variable

Effects:
    We have effects when reactivity is built on top of existing variables

### Effects

Ideally we should be able to have effects that react to variables, functions and attributes

```typescript
// Effects
Network.onChange((attributeA, attributeB) => {

}, state.attributeA, state.attributeB)
```

The values we are reacting to are passed back to the parameters because we don't want to enforce that the code outside the reactive function to need to know the changed values.

The problem with this approach is that it assumes that the language (JavaScript) has native reactivity, which is not the case as for the moment of this writting.

So, in order to implement reactivity we are required to work with observables

### Observables

Ideally observables would be handled at compile time so the compiler could point out code errors

```myTerribleCompiledLanguage
obs : Observable<Number> myObservable = 0
```

Since it is not reasonable to expect this at an early stage of development observables will be handled at runtime for now

```typescript
const myObservable = observable(0)
```

Enforcing reactivity is only required in specific use cases, an argument could be made that enforced reactivity increases quality assurance, but the complexity that it brings is just not worth it for most projects at the moment

# Implementation challenges

**Web Worker, Node and Browser.**

As of this writting the nodejs and browser workers have different interfaces.

**Naming**

RxJs is the most popular library that implements reactivity through Observables, but it doesn't consider that the Observable is a variable with a name, the name property is not registered in the observable object, making it unsuitable for the need of communicating to consumers the name of the variable that changed

## Why break up with RxJs?

RxJs is too ambitious. I love functional programming, and I am sure there is a need for a native JavaScript push system, but the word observable just doesn't fit well with what RxJs is trying to do. The fact that they have another class called Subject which is necessary to make multiple subscriptions just proves that. The fact that they have another class called BehaviorSubject that allows the knowledge of the observable value (or what should have been the observable). Just think of the absurd that is calling something an observable and then proceeding to argue that an observable thing doesn't have a value and just emmits events with special rules. RxJs Observable are just special event emitters.

## Reproducing useEffect

Why do we want this?

Anyone who seriously tried react hooks will know how easy state management can be, and the useEffect represents that the most. You just tell useEffect what do you want to do and when you want to do it. But it only works because you are working within react and that won't be enough for the purpose of having a cross framework, cross thread, observable.

Many other state management libraries struggle to reproduce the functionality of the react hook useEffect. That is mainly because state management outside of react does not have a re-rendering event that is guaranted in the context of React. React keeps track of components that are being executed and because of that it is able to do all that it does.

