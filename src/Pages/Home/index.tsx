import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import qs from "qs";

import Header from "../../components/Header";

import { Container, Card, Templates, Form, Button } from "./styles";

import logo from "../../images/logo.svg";

interface Templates {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

const Home: React.FC = () => {
  const [templates, setTemplates] = useState<Templates[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Templates | null>(
    null
  );
  const [boxes, setBoxes] = useState<string[]>([]);
  const [generatedMeme, setGeneratedMeme] = useState("");

  useEffect(() => {
    (async () => {
      const resp = await fetch("https://api.imgflip.com/get_memes");
      const {
        data: { memes },
      } = await resp.json();

      setTemplates(memes);
    })();
  }, []);

  const handleInputChange = (index: number) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newValues = boxes;
    newValues[index] = e.target.value;

    setBoxes(newValues);
  };

  function handleSelectTemplate(template: Templates) {
    setSelectedTemplate(template);
    setBoxes([]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const params = qs.stringify({
      template_id: selectedTemplate?.id,
      username: "coguri",
      password: "12345678",
      boxes: boxes.map((text) => ({ text })),
    });

    try {
      const resp = await fetch(
        `https://api.imgflip.com/caption_image?${params}`
      );
      const {
        data: { url },
      } = await resp.json();

      setGeneratedMeme(String(url));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleReset() {
    setSelectedTemplate(null);
    setBoxes([]);
    setGeneratedMeme("");
  }

  return (
    <Container>
      <img src={logo} alt="memeMaker" />
      <Card>
        {generatedMeme && (
          <>
            <img src={generatedMeme} alt="Generated meme" />

            <Button type="button" onClick={handleReset}>
              Criar outro meme
            </Button>
          </>
        )}
        {!generatedMeme && (
          <>
            <h2>Selecione o template</h2>
            <Templates>
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleSelectTemplate(template)}
                  className={
                    template.id === selectedTemplate?.id ? "selected" : ""
                  }
                >
                  <img src={template.url} alt={template.name} />
                </button>
              ))}
            </Templates>

            {selectedTemplate && (
              <>
                <h2>Textos</h2>

                <Form onSubmit={handleSubmit}>
                  {new Array(selectedTemplate.box_count)
                    .fill("")
                    .map((_, index) => (
                      <input
                        key={String(Math.random())}
                        placeholder={`Text #${index + 1}`}
                        onChange={handleInputChange(index)}
                      />
                    ))}
                  <Button type="submit">MakeMyMeme</Button>
                </Form>
              </>
            )}
          </>
        )}
      </Card>
    </Container>
  );
};

export default Home;
