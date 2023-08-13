import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'
import isEqual from 'lodash.isequal'

type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue>

export const observe = <T extends JSONValue>(name: string, value: T) => {
    const obs = new BehaviorSubject(value)
    return {
        name,
        obs,
        onChange: (callback: (value: T) => void) => (
            onChange(callback, obs)
        ),
        set: (param: (prev: T) => T | T) => obs.next(
            typeof param === 'function' ? param(obs.getValue()) : param
        ),
        value: obs.getValue
    }
}

export const onChange = <T>(callback: (value: T) => void, observable: BehaviorSubject<T>) => (
    observable.pipe(
        distinctUntilChanged( isEqual )
    ).subscribe(callback)
)
