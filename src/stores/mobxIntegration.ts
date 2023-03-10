import { Reaction } from "mobx"
import { enableExternalSource } from "solid-js"

// This is the secret sauce that makes it work
//
// To learn more about this, see:
//  - https://github.com/solidjs/solid/blob/main/CHANGELOG.md#external-sources-experimental
//  - https://github.com/mobxjs/mobx/discussions/3203

let id = 0
// enableExternalSource is a Solid API that allows you to
// integrate with other reactive libraries, in our case MobX
enableExternalSource((fn, trigger) => {
  // the mobx Reaction API is what allows us to push changes from mobx
  // into solid in a reactive way
  const reaction = new Reaction(`externalSource@${++id}`, trigger)
  return {
    track: (x) => {
      let next
      reaction.track(() => {
        try {
          // I have no idea how to type this
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const nextVal = fn(x)
          next = nextVal
        } catch (e) {
          console.error(e)
        }
      })
      return next
    },
    dispose: () => {
      reaction.dispose()
    },
  }
})
