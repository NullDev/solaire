// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Logging utility class
 *
 * @class Log
 */
class Logger {
    static LOG_PREFIXES = {
        error: "\x1b[41m\x1b[315m x \x1b[0m\x1b[31m",
        warn: "\x1b[43m\x1b[30m ! \x1b[0m\x1b[33m",
        debug: "\x1b[45m\x1b[30m d \x1b[0m\x1b[35m",
        wait: "\x1b[46m\x1b[30m ⧖ \x1b[0m\x1b[36m",
        info: "\x1b[44m\x1b[30m i \x1b[0m\x1b[36m",
        done: "\x1b[42m\x1b[30m ✓ \x1b[0m\x1b[32m",
        reset: "\x1b[0m",
    };

    /**
     * Get neatly formatted date
     *
     * @return {string}
     * @static
     * @memberof Log
     */
    static #getDate(){
        const options = {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        const date = new Intl.DateTimeFormat(
            "en-US",
            /** @type {Intl.DateTimeFormatOptions} */ (options),
        ).format(new Date());

        return `[${date}]`;
    }

    /**
     * Perform log action
     *
     * @param {string} str
     * @memberof Log
     */
    static #logger(str){
        console.log(str);
    }

    /**
     * Log an error
     *
     * @static
     * @param {string} input
     * @param {Object} options
     * @memberof Log
     */
    static error(input, options){
        const log = `[ERROR] ${this.#getDate()} - ${input}`;
        this.#logger(
            `${this.LOG_PREFIXES.error} ${log}${this.LOG_PREFIXES.reset}`,
        );

        if (options?.trace?.stack){
            const eLog = `[TRACE] ${this.#getDate()} - ${options.trace.stack}`;
            this.#logger(
                `${this.LOG_PREFIXES.error} ${eLog}${this.LOG_PREFIXES.reset}`,
            );
        }
    }

    /**
     * Log a warning
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static warn(input){
        const log = `[WARN]  ${this.#getDate()} - ${input}`;
        this.#logger(
            `${this.LOG_PREFIXES.warn} ${log}${this.LOG_PREFIXES.reset}`,
        );
    }

    /**
     * Log a debug message
     * (only if NODE_ENV is set to development)
     *
     * @static
     * @param {string} input
     * @param {Object} options
     * @memberof Log
     */
    static debug(input, options){
        if (process.env.NODE_ENV !== "development" && !options?.force) return;
        const log = `[DEBUG] ${this.#getDate()} - ${input}`;
        this.#logger(
            `${this.LOG_PREFIXES.debug} ${log}${this.LOG_PREFIXES.reset}`,
        );
    }

    /**
     * Log a wait message
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static wait(input){
        const log = `[WAIT]  ${this.#getDate()} - ${input}`;
        this.#logger(
            `${this.LOG_PREFIXES.wait} ${log}${this.LOG_PREFIXES.reset}`,
        );
    }

    /**
     * Log an info
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static info(input){
        const log = `[INFO]  ${this.#getDate()} - ${input}`;
        this.#logger(
            `${this.LOG_PREFIXES.info} ${log}${this.LOG_PREFIXES.reset}`,
        );
    }

    /**
     * Log a success
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static done(input){
        const log = `[DONE]  ${this.#getDate()} - ${input}`;
        this.#logger(
            `${this.LOG_PREFIXES.done} ${log}${this.LOG_PREFIXES.reset}`,
        );
    }

    /**
     * Log a message without any formatting
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static raw(input){
        this.#logger(input);
    }
}

export default Logger;
