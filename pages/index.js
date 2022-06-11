import Head from "next/head";
import Link from "next/link";
import Card from "../components/Card";

export default function Home() {
    return (
        <div>
            <Head>
                <title>Sanjit's Games</title>
                <meta name="robots" content="index, follow" />
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <meta
                    name="description"
                    content="Homepage of Sanjit's Games subdomain: The funnest personal website on planet Earth."
                />
            </Head>
            <h1>Games</h1>
            <p>
                This part of my website will have games here. Things like 15
                puzzle and more to come. I might also try to AI-ificate it or
                something? maybe. i dont know. yea its hard to tell what im
                going to be up to.
            </p>
            <br />
            <Card
                style={{ maxWidth: "400px" }}
                name="15 Puzzle"
                description="A 15 Puzzle Game with a few varients"
                src="https://raw.githubusercontent.com/Sanjit1/sanjitsarda.com/main/pages/portfolio/assets/15puzzle.png"
                link="https://games.sanjitsarda.com/15puzzle"
                properties={{
                    language: ["JS"],
                    tools: ["React.js", "Next.js"],
                    platform: ["RPi"],
                    types: ["Bored"],
                }}
                linked={true}
                yellow={true}
            />
        </div>
    );
}
